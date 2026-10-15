import type { Metadata } from "next";

import { Contact } from "@/components/sections/contact";
import { Engagements } from "@/components/sections/engagements/engagements";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process/process";
import { Services } from "@/components/sections/services/services";
import { GrowIn } from "@/components/motion/grow";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
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
