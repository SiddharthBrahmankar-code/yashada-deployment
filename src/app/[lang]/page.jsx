import HeroExperience from '@/components/HeroExperience';
import WhatWeDo from '@/components/WhatWeDo';
import PinnedProducts from '@/components/PinnedProducts';
import StatsCounter from '@/components/StatsCounter';
import BrandMarquee from '@/components/BrandMarquee';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <>
      <HeroExperience />
      <WhatWeDo />
      <PinnedProducts />
      <StatsCounter />
      <BrandMarquee />
      <Testimonials />
      <CTASection />
    </>
  );
}
