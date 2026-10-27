import type { Metadata } from "next";

const title = "The Paradox of Choice | Ibrahim Hussein";
const description = "Watch three choices multiply as you approach them. An interactive canvas experiment using exponential spawning and repulsion to explore decision overload.";
const image = "/images/social/lab-paradox-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/paradox/" },
  openGraph: {
    title,
    description,
    url: "/paradox/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
