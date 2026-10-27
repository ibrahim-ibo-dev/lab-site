import type { Metadata } from "next";

const title = "Selective Blindness | Ibrahim Hussein";
const description = "Move a spotlight across a canvas of distractions and hidden text. Ibrahim Hussein's interactive experiment explores selective attention and what we overlook.";
const image = "/images/social/lab-blindness-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blindness/" },
  openGraph: {
    title,
    description,
    url: "/blindness/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
