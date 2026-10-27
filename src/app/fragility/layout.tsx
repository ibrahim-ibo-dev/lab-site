import type { Metadata } from "next";

const title = "The Fragility of Connection | Ibrahim Hussein";
const description = "Build a crystalline connection with careful movement, then see how sudden motion breaks it. A canvas experiment about patience, trust, and fragile bonds.";
const image = "/images/social/lab-fragility-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/fragility/" },
  openGraph: {
    title,
    description,
    url: "/fragility/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
