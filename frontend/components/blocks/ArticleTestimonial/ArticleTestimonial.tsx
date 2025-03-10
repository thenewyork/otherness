import styled from 'styled-components';
import LayoutWrapper from '../../common/LayoutWrapper';
import LayoutGrid from '../../common/LayoutGrid';
import pxToRem from '../../../utils/pxToRem';
import { useInView } from 'react-intersection-observer';

type Props = {
	testimonial: string;
};

const ArticleTestimonialWrapper = styled.section`
	margin-bottom: ${pxToRem(40)};
`;

const Testimonial = styled.div`
	grid-column: 5 / -5;

	@media ${(props) => props.theme.mediaBreakpoints.tabletMedium} {
		grid-column: 3 / -3;
	}

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		grid-column: 1 / -1;
	}

	* {
		font-family: var(--font-baryton);
		font-size: ${pxToRem(30)};
		line-height: ${pxToRem(38)};
		letter-spacing: -0.3px;
		font-weight: 200;

		@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(24)};
			line-height: ${pxToRem(31)};
			letter-spacing: -0.24px;
		}
	}
`;

const ArticleTestimonial = (props: Props) => {
	const { testimonial } = props;

	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.2,
		rootMargin: '-50px'
	});

	const formattedTestimonial: string = testimonial
		? `<p>${testimonial.replace(/\n/g, '<br />')}</p>`
		: '';

	return (
		<ArticleTestimonialWrapper
			ref={ref}
			className={`view-element-fade-in ${
				inView ? 'view-element-fade-in--in-view' : ''
			}`}
		>
			<LayoutWrapper>
				<LayoutGrid>
					<Testimonial
						dangerouslySetInnerHTML={{
							__html: formattedTestimonial
						}}
					/>
				</LayoutGrid>
			</LayoutWrapper>
		</ArticleTestimonialWrapper>
	);
};

export default ArticleTestimonial;
