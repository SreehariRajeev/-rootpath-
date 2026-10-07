import type { Metadata } from "next";

import { Contact } from "@/components/sections/contact";
import { Capabilities } from "@/components/sections/capabilities";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
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
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
