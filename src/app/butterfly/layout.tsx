import type { Metadata } from "next";

const title = "The Butterfly Effect | Ibrahim Hussein";
const description = "Click a dot to send waves through a canvas grid. Explore how one interaction transforms a field of particles in Ibrahim Hussein's Butterfly Effect experiment.";
const image = "/images/social/lab-butterfly-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/butterfly/" },
  openGraph: {
    title,
    description,
    url: "/butterfly/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
