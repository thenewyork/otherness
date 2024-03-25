import styled from 'styled-components';
import client from '../../client';
import { ArticleType, TransitionsType } from '../../shared/types/types';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import ArticleHeader from '../../components/blocks/ArticleHeader';
import OthernessPageBuilder from '../../components/common/OthernessPageBuilder';
import RelatedConversations from '../../components/blocks/RelatedConversations';

type Props = {
	data: ArticleType;
	pageTransitionVariants: TransitionsType;
};

const PageWrapper = styled(motion.div)``;

const Page = (props: Props) => {
	const { data, pageTransitionVariants } = props;

	const {
		author,
		authorUrl,
		excerpt,
		pageBuilder,
		relatedArticle,
		tag,
		thumbnailMedia,
		title
	} = data;

	console.log('data', data);

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
			<ArticleHeader
				media={thumbnailMedia}
				title={title}
				excerpt={excerpt}
				tag={tag}
				author={author}
			/>
			<OthernessPageBuilder data={pageBuilder} useType />
			<RelatedConversations data={relatedArticle} />
		</PageWrapper>
	);
};

export async function getStaticPaths() {
	const articlesQuery = `
		*[_type == 'article'] [0...100] {
			slug
		}
	`;

	const allArticles = await client.fetch(articlesQuery);

	return {
		paths: allArticles.map((item: any) => {
			return `/conversations/${item?.slug?.current}`;
		}),
		fallback: true
	};
}

export async function getStaticProps({ params }: any) {
	const articleQuery = `
		*[_type == 'article' && slug.current == "${params.slug[0]}"][0] {
			...,
			thumbnailMedia {
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
			relatedArticle[]-> {
				author,
				excerpt,
				slug,
				tag,
				theme,
				thumbnailMedia {
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
				title
			},
			pageBuilder[] {
				...,
				thumbnailMedia {
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
			}
		}
	`;

	const data = await client.fetch(articleQuery);

	return {
		props: {
			data
		}
	};
}

export default Page;
