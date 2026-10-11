import type { Metadata } from "next";

const title = "The Endless Horizon | Ibrahim Hussein";
const description = "Chase a goal that moves away as you approach. Ibrahim Hussein's interactive canvas experiment combines repulsion mathematics with an aurora-like landscape.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
