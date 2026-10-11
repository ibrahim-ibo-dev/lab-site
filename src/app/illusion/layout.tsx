import type { Metadata } from "next";

const title = "The Illusion of Opportunity | Ibrahim Hussein";
const description = "An interactive canvas experiment: approach ten open doors and watch them close. Explore proximity, choice, and opportunity in Ibrahim Hussein's Lab.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
