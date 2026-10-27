import type { Metadata } from "next";

const title = "The Illusion of Opportunity | Ibrahim Hussein";
const description = "An interactive canvas experiment: approach ten open doors and watch them close. Explore proximity, choice, and opportunity in Ibrahim Hussein's Lab.";
const image = "/images/social/lab-illusion-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/illusion/" },
  openGraph: {
    title,
    description,
    url: "/illusion/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
