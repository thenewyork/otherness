import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import {
	HomePageType,
	SiteSettingsType,
	TransitionsType
} from '../shared/types/types';
import { motion } from 'framer-motion';
import client from '../client';
import {
	homePageQueryString,
	siteSettingsQueryString
} from '../lib/sanityQueries';
import HomeHero from '../components/blocks/HomeHero';
import Header from '../components/layout/Header';
import HomeWhatToExpect from '../components/blocks/HomeWhatToExpect';
import MobileMenu from '../components/blocks/MobileMenu';
import { useEffect, useState } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import { useRouter } from 'next/router';

const PageWrapper = styled(motion.div)``;

type Props = {
	data: HomePageType;
	siteSettings: SiteSettingsType;
	pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
	const { data, siteSettings, pageTransitionVariants } = props;

	const [mobileMenuIsActive, setMobileMenuIsActive] = useState(false);

	const lenis = useLenis(({ scroll }) => {});
	const router = useRouter();

	console.log('data', data);
	console.log('siteSettings', siteSettings);

	const handleMobileMenuTrigger = () => {
		const windowHeight = window.innerHeight;
		const scrollPosition = window.scrollY;

		const header = document.querySelector('.header');
		const headerHeight = header?.clientHeight;

		if (!headerHeight) return;

		if (scrollPosition < windowHeight) {
			if (mobileMenuIsActive === false) {
				if (!lenis) return;
				lenis.scrollTo(windowHeight - headerHeight);
				const timeout = setTimeout(() => {
					setMobileMenuIsActive(true);
					clearTimeout(timeout);
				}, 500);
			} else {
				setMobileMenuIsActive(false);
			}
		} else {
			setMobileMenuIsActive(!mobileMenuIsActive);
		}
	};

	useEffect(() => {
		if (!lenis) return;

		if (mobileMenuIsActive) {
			const timer = setTimeout(() => {
				lenis.stop();
				clearTimeout(timer);
			}, 1000);
		} else {
			lenis.start();
		}
	}, [mobileMenuIsActive]);

	useEffect(() => {
		setMobileMenuIsActive(false);
	}, [router]);

	return (
		<PageWrapper
			variants={pageTransitionVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<NextSeo
				title={data?.seoTitle || 'Otherness'}
				description={data?.seoDescription || ''}
			/>
			<HomeHero />
			<Header
				isHomeVersion
				mobileMenuIsActive={mobileMenuIsActive}
				setMobileMenuIsActive={() => handleMobileMenuTrigger()}
			/>
			<MobileMenu
				isActive={mobileMenuIsActive}
				setMobileMenuIsActive={setMobileMenuIsActive}
				cta={siteSettings?.mobileMenuConsultationCta}
				buttonTitle={siteSettings?.mobileMenuConsultationButtonTitle}
				buttonUrl={siteSettings?.footerConsultationButtonUrl}
			/>
			<HomeWhatToExpect />
		</PageWrapper>
	);
};

export async function getStaticProps() {
	const siteSettings = await client.fetch(siteSettingsQueryString);
	const data = await client.fetch(homePageQueryString);

	return {
		props: {
			data,
			siteSettings
		}
	};
}

export default Page;
