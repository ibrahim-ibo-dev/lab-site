import type { Metadata } from "next";

const title = "The Paradox of Choice | Ibrahim Hussein";
const description = "Watch three choices multiply as you approach them. An interactive canvas experiment using exponential spawning and repulsion to explore decision overload.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
