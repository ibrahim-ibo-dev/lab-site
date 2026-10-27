import type { Metadata } from "next";

const title = "The Endless Horizon | Ibrahim Hussein";
const description = "Chase a goal that moves away as you approach. Ibrahim Hussein's interactive canvas experiment combines repulsion mathematics with an aurora-like landscape.";
const image = "/images/social/lab-horizon-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/horizon/" },
  openGraph: {
    title,
    description,
    url: "/horizon/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
