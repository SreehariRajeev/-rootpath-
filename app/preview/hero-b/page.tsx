import type { Metadata } from "next";

import { Contact } from "@/components/sections/contact";
import { Engagements } from "@/components/sections/engagements/engagements";
import { Footer } from "@/components/sections/footer";
import { HeroStatement } from "@/components/sections/hero-options/hero-statement";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process/process";
import { Services } from "@/components/sections/services/services";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { GrowIn } from "@/components/motion/grow";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";

// Local hero preview, not linked from the site.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function HeroPreview() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <HeroStatement />
        <Services />
        <Engagements />
        <Process />
        <GrowIn>
          <Contact />
        </GrowIn>
      </main>
      <Footer />
    </>
  );
}
