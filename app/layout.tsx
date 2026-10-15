import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  getJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

import "lenis/dist/lenis.css";
import "./globals.css";

export const dynamic = "force-static";

// Space Grotesk and Inter ship the same file whether or not weights are listed, so leaving
// `weight` out only drops the per-weight @font-face rules from the render-blocking CSS.
// JetBrains Mono keeps its list: the full variable range is a larger file than the 400-700 slice.
const display = Space_Grotesk({
  variable: "--font-root-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-root-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-root-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#f7f9f8",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          display.variable,
          body.variable,
          mono.variable,
          "min-h-[100dvh] overflow-x-hidden bg-background font-sans text-foreground antialiased",
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <div className="min-h-[100dvh]">{children}</div>
      </body>
    </html>
  );
}
