import Image from 'next/image';
import styled from 'styled-components';
import { MediaType } from '../../../shared/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import useViewportWidth from '../../../hooks/useViewportWidth';

const ImageComponentWrapper = styled.div`
	position: relative;
	background-color: rgba(0, 0, 0, 0.1);
	overflow: hidden;

	mux-player,
	img {
		object-fit: cover;
		transition: all var(--transition-speed-extra-slow)
			var(--transition-ease);
	}
`;

const InnerBlur = styled(motion.div)`
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
	z-index: 1;
`;

const Inner = styled(motion.div)`
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
`;

const wrapperVariants = {
	hidden: {
		opacity: 1,
		filter: 'blur(3px)',
		scale: 1.01,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 0,
		filter: 'blur(0px)',
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut',
			delay: 0.15
		}
	}
};

const defaultVariants = {
	hidden: {
		opacity: 0,
		filter: 'blur(3px)',
		scale: 1.02,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 1,
		filter: 'blur(0px)',
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	}
};

type Props = {
	data: MediaType;
	isPriority: boolean;
	inView: boolean;
};

const ImageComponent = (props: Props) => {
	const { data, isPriority, inView } = props;

	const viewport = useViewportWidth();
	const isMobile = viewport === 'mobile';

	const imageUrl =
		isMobile && data?.mobileImage?.asset?.url
			? data.mobileImage.asset.url
			: data?.image?.asset?.url;
	const blurDataURL =
		isMobile && data?.mobileImage?.asset?.metadata?.lqip
			? data.mobileImage.asset.metadata.lqip
			: data?.image?.asset?.metadata?.lqip;

	return (
		<ImageComponentWrapper className="image-component-wrapper">
			<Inner
				variants={defaultVariants}
				initial="hidden"
				animate={inView ? 'visible' : 'hidden'}
			>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt={data?.image?.alt || ''}
						fill
						priority={isPriority}
						blurDataURL={blurDataURL}
					/>
				)}
			</Inner>
		</ImageComponentWrapper>
	);
};

export default ImageComponent;
