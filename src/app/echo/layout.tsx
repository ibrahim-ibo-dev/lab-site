import type { Metadata } from "next";

const title = "The Echo Chamber | Ibrahim Hussein";
const description = "Explore a canvas simulation where absorbing familiar shapes thickens your bubble. An interactive metaphor for echo chambers, selective exposure, and escape.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
