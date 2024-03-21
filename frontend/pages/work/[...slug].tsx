import styled from 'styled-components';
import client from '../../client';
import {
	ProjectType,
	TransitionsType,
	WorkPageType
} from '../../shared/types/types';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import OthernessPageBuilder from '../../components/common/OthernessPageBuilder';
import CtaBanner from '../../components/blocks/CtaBanner';
import ExploreFurther from '../../components/blocks/ExploreFurther';
import WorkIntro from '../../components/blocks/WorkIntro';
import WorkHero from '../../components/blocks/WorkHero';
import WorkDetails from '../../components/blocks/WorkDetails/WorkDetails';
import { workPageQueryString } from '../../lib/sanityQueries';
import { useEffect } from 'react';

type Props = {
	data: ProjectType;
	workPageData: WorkPageType;
	pageTransitionVariants: TransitionsType;
};

const PageWrapper = styled(motion.div)`
	padding-top: var(--header-h);
	min-height: 150vh;
	background: var(--colour-white);

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		padding-top: calc(var(--header-h) + 16px);
	}
`;

const Page = (props: Props) => {
	const { data, workPageData, pageTransitionVariants } = props;

	const {
		collaborators,
		description,
		excerpt,
		fullWidthHero,
		heroLayoutType,
		imageBlocks,
		mood,
		relatedProject,
		slug,
		subProjects,
		tagline,
		thumbnailMedia,
		title,
		twoColumnHero,
		type
	} = data;

	const { ctaBannerTitle, ctaBannerLink, ctaBannerMedia } = workPageData;

	console.log('data', data);
	// console.log('workPageData', workPageData);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={data?.title || 'Ultra'}
				description={data?.excerpt || ''}
			/>
			<WorkIntro excerpt={excerpt} tagline={tagline} types={type} />
			<WorkHero
				heroLayoutType={heroLayoutType}
				twoColumnHero={twoColumnHero}
				fullWidthHero={fullWidthHero}
			/>
			<WorkDetails
				client={title}
				collaborators={collaborators}
				description={description}
			/>
			<OthernessPageBuilder data={imageBlocks} useImageComponent />
			<CtaBanner
				title={ctaBannerTitle}
				media={ctaBannerMedia}
				link={ctaBannerLink}
			/>
			<ExploreFurther />
		</PageWrapper>
	);
};

export async function getStaticPaths() {
	const projectsQuery = `
		*[_type == 'project'] [0...100] {
			slug
		}
	`;

	const allProjects = await client.fetch(projectsQuery);

	return {
		paths: allProjects.map((item: any) => {
			return `/work/${item?.slug?.current}`;
		}),
		fallback: true
	};
}

export async function getStaticProps({ params }: any) {
	const mediaTypeString = `
		mediaType,
		image {
			alt,
			asset-> {
				url,
			},
		},
		video {
			asset-> {
				playbackId,
			},
		},
		mobileImage {
			alt,
			asset-> {
				url,
			},
		},
		mobileVideo {
			asset-> {
				playbackId,
			},
		}
	`;

	const projectQuery = `
		*[_type == 'project' && slug.current == "${params.slug[0]}"][0] {
			...,
			fullWidthHero {
				${mediaTypeString}
			},
			twoColumnHero {
				leftBlock {
					${mediaTypeString}
				},
				rightBlock {
					${mediaTypeString}
				},
			},
			imageBlocks[] {
				...,
				imageComponentOneHalfOneXSmall {
					half {
						${mediaTypeString}
					},
					xSmall {
						${mediaTypeString}
					}
				},
				imageComponentTwoXSmall {
					lhs {
						${mediaTypeString}
					},
					rhs {
						${mediaTypeString}
					}
				},
				imageComponentOneHalf {
					${mediaTypeString},
					selectPosition
				},
				imageComponentEditorialBig {
					editorialBlock {
						description,
						title,
						theme
					},
					selectPosition,
					media {
						${mediaTypeString}
					}
				},
				imageComponentLandscape {
					${mediaTypeString},
					selectPosition
				},
				imageComponentOneBigTwoSmall {
					big {
						${mediaTypeString}
					},
					small1 {
						${mediaTypeString}
					},
					small2 {
						${mediaTypeString}
					}
				},
				imageComponentOneEditorial {
					selectPosition,
					editorialBlock {
						description,
						title,
						theme
					}
				},
				imageComponentOnePortrait {
					selectPosition,
					selectSize,
					${mediaTypeString}
				},
				imageComponentTwoSmall {
					selectPosition,
					small1 {
						${mediaTypeString}
					},
					small2 {
						${mediaTypeString}
					}
				},
				imageComponentFull {
					${mediaTypeString}
				},
				imageComponentOnePortraitOneMedium {
					selectPosition,
					portrait {
						${mediaTypeString}
					},
					medium {
						${mediaTypeString}
					}
				},
				imageComponentOneBig {
					selectPosition,
					${mediaTypeString}
				},
				imageComponentOneSmallOneBigLandscape {
					selectPosition,
					landscape {
						${mediaTypeString}
					},
					small {
						${mediaTypeString}
					}
				},
				imageComponentOneBigOneXSmall {
					selectPosition,
					big {
						${mediaTypeString}
					},
					small {
						${mediaTypeString}
					}
				}
			},
			relatedProject-> {
				slug,
				title,
				heroLayoutType,
				fullWidthHero {
					mediaType,
					image {
						asset-> {
							url,
						},
					},
					video {
						asset-> {
							playbackId,
						},
					},
				},
				twoColumnHero {
					leftBlock {
						mediaType,
						image {
							asset-> {
								url,
							},
						},
						video {
							asset-> {
								playbackId,
							},
						},
					},
					rightBlock {
						mediaType,
						image {
							asset-> {
								url,
							},
						},
						video {
							asset-> {
								playbackId,
							},
						},
					},
				},
			},
		}
	`;

	let workPageData = await client.fetch(workPageQueryString);
	const data = await client.fetch(projectQuery);
	workPageData = workPageData[0];

	return {
		props: {
			data,
			workPageData
		}
	};
}

export default Page;
