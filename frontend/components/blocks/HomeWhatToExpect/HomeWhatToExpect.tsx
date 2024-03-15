import styled from 'styled-components';
import { ButtonType } from '../../../shared/types/types';
import LayoutWrapper from '../../common/LayoutWrapper';
import LayoutGrid from '../../common/LayoutGrid';
import { PortableText } from '@portabletext/react';
import pxToRem from '../../../utils/pxToRem';
import ArrowButton from '../../elements/ArrowButton';

type Props = {
	title: string;
	content: [];
	button: ButtonType;
};

const HomeWhatToExpectWrapper = styled.section`
	background: var(--colour-black);
	height: 200vh;
	padding: ${pxToRem(136)} 0;
`;

const TitleWrapper = styled.div`
	grid-column: 3 / 11;
`;

const Title = styled.h3`
	color: var(--colour-white);
`;

const ContentWrapper = styled.div`
	grid-column: 13 / 23;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${pxToRem(40)};
`;

const RichTextWrapper = styled.div`
	* {
		color: var(--colour-white);
	}
`;

const HomeWhatToExpect = (props: Props) => {
	const { title, content, button } = props;

	return (
		<HomeWhatToExpectWrapper>
			<LayoutWrapper>
				<LayoutGrid>
					<TitleWrapper>
						{title && (
							<Title className="type-secondary-heading-large">
								{title}
							</Title>
						)}
					</TitleWrapper>
					<ContentWrapper>
						{content && (
							<RichTextWrapper className="rich-text rich-text--medium">
								<PortableText value={content} />
							</RichTextWrapper>
						)}
						{button && (
							<ArrowButton data={button}>
								{button.title}
							</ArrowButton>
						)}
					</ContentWrapper>
				</LayoutGrid>
			</LayoutWrapper>
		</HomeWhatToExpectWrapper>
	);
};

export default HomeWhatToExpect;
