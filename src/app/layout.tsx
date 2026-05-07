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
  keywords: ["interactive", "experiments", "web art", "psychology", "canvas", "Ibrahim Hussein"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lab — Code & Psychology",
    description: "Interactive web experiments by Ibrahim Hussein.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  other: { "theme-color": "#07070E" },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
