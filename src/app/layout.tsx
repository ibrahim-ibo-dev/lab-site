import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lab.ibrahim-eng.dev"),
  title: "The Lab — Code & Psychology | Ibrahim Hussein",
  description:
    "Standalone interactive web experiments that turn abstract psychological concepts into visceral, code-driven experiences.",
  keywords: [
    "Ibrahim Hussein",
    "Ibrahim Hussein experiments",
    "Ibrahim Hussein lab",
    "Ibrahim Hussein web art",
    "Ibrahim Hussein psychology",
    "interactive web experiments",
    "code and psychology",
    "canvas experiments",
    "web art Kurdistan",
    "creative coding Ibrahim",
    "psychology experiments web",
    "chaos theory canvas",
    "butterfly effect simulation",
    "echo chamber experiment",
  ],
  authors: [{ name: "Ibrahim Hussein" }],
  creator: "Ibrahim Hussein",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "The Lab — Code & Psychology",
    description: "Interactive web experiments by Ibrahim Hussein — where code meets human psychology.",
    siteName: "The Lab",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Lab by Ibrahim Hussein",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lab — Code & Psychology",
    description: "Interactive web experiments by Ibrahim Hussein.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.svg" },
  other: { "theme-color": "#07070E" },
};

import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* AI Crawlers */}
        <link rel="alternate" type="text/plain" href="https://ibrahim-eng.dev/llms.txt" title="LLMs.txt" />
        {/* Geo tags */}
        <meta name="geo.region" content="IQ-AR" />
        <meta name="geo.placename" content="Erbil, Kurdistan Region" />
        <meta name="subject" content="Interactive Web Experiments, Code & Psychology, Ibrahim Hussein" />
        <meta name="classification" content="Web Art, Interactive Experiments, Creative Coding" />
        <meta name="revisit-after" content="7 days" />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "The Lab \u2014 Code & Psychology by Ibrahim Hussein",
              description: "Interactive web experiments that turn abstract psychological concepts into visceral, code-driven experiences.",
              url: "https://lab.ibrahim-eng.dev",
              author: {
                "@type": "Person",
                name: "Ibrahim Hussein",
                url: "https://ibrahim-eng.dev",
                jobTitle: "Computer Engineer & AI Developer"
              },
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: 8,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "The Illusion of Opportunity", url: "https://lab.ibrahim-eng.dev/illusion" },
                  { "@type": "ListItem", position: 2, name: "The Weight of the Past", url: "https://lab.ibrahim-eng.dev/weight" },
                  { "@type": "ListItem", position: 3, name: "The Endless Horizon", url: "https://lab.ibrahim-eng.dev/horizon" },
                  { "@type": "ListItem", position: 4, name: "The Fragility of Connection", url: "https://lab.ibrahim-eng.dev/fragility" },
                  { "@type": "ListItem", position: 5, name: "The Paradox of Choice", url: "https://lab.ibrahim-eng.dev/paradox" },
                  { "@type": "ListItem", position: 6, name: "The Echo Chamber", url: "https://lab.ibrahim-eng.dev/echo" },
                  { "@type": "ListItem", position: 7, name: "Selective Blindness", url: "https://lab.ibrahim-eng.dev/blindness" },
                  { "@type": "ListItem", position: 8, name: "The Butterfly Effect", url: "https://lab.ibrahim-eng.dev/butterfly" }
                ]
              }
            })
          }}
        />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
