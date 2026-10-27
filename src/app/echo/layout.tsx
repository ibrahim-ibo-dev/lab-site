import type { Metadata } from "next";

const title = "The Echo Chamber | Ibrahim Hussein";
const description = "Explore a canvas simulation where absorbing familiar shapes thickens your bubble. An interactive metaphor for echo chambers, selective exposure, and escape.";
const image = "/images/social/lab-echo-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/echo/" },
  openGraph: {
    title,
    description,
    url: "/echo/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
