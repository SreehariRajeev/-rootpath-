import type { Metadata } from "next";

import { Capabilities } from "@/components/sections/capabilities";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <ThemeToggle />
      <main>
        <Hero />
        <Capabilities />
        <Process />
      </main>
      <Footer />
    </>
  );
}
