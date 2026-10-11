import type { Metadata } from "next";

const title = "The Fragility of Connection | Ibrahim Hussein";
const description = "Build a crystalline connection with careful movement, then see how sudden motion breaks it. A canvas experiment about patience, trust, and fragile bonds.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
