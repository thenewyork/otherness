import styled from 'styled-components';
import pxToRem from '../../../utils/pxToRem';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type StyledProps = {
	$divWidth: number;
};

type Props = {
	title: string;
	description: string;
	theme: string;
};

const EditorialCardWrapper = styled.div`
	width: 100%;
`;

const Inner = styled.div<StyledProps>`
	min-height: ${(props) => props.$divWidth}px;
	width: 100%;
	padding: ${pxToRem(24)};
	background: var(--colour-black);

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		min-height: unset;
	}

	* {
		color: var(--colour-white);
	}
`;

const Title = styled.h4`
	margin-bottom: ${pxToRem(24)};
`;

const Description = styled.p``;

const EditorialCard = (props: Props) => {
	const { title, description } = props;

	const [divWidth, setDivWidth] = useState(0);

	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const handleResize = () => {
			if (ref.current) {
				setDivWidth(ref.current.offsetWidth);
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);
	}, []);

	const { ref: ref2, inView } = useInView({
		triggerOnce: true,
		threshold: 0.2,
		rootMargin: '-50px'
	});

	return (
		<EditorialCardWrapper
			ref={ref}
			className={`editorial-card view-element-fade-in ${
				inView ? 'view-element-fade-in--in-view' : ''
			}`}
		>
			<Inner $divWidth={divWidth} ref={ref2}>
				{title && <Title>{title}</Title>}
				{description && (
					<Description className="type-secondary-heading-medium">
						{description}
					</Description>
				)}
			</Inner>
		</EditorialCardWrapper>
	);
};

export default EditorialCard;
