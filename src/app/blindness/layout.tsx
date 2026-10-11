import type { Metadata } from "next";

const title = "Selective Blindness | Ibrahim Hussein";
const description = "Move a spotlight across a canvas of distractions and hidden text. Ibrahim Hussein's interactive experiment explores selective attention and what we overlook.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
