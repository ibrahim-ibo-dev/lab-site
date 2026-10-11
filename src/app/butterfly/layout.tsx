import type { Metadata } from "next";

const title = "The Butterfly Effect | Ibrahim Hussein";
const description = "Click a dot to send waves through a canvas grid. Explore how one interaction transforms a field of particles in Ibrahim Hussein's Butterfly Effect experiment.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
