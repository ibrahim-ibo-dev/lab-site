import type { Metadata } from "next";

const title = "The Weight of the Past | Ibrahim Hussein";
const description = "An interactive canvas experiment about momentum and memory. Move quickly to gather shadow echoes, then slow down and observe the weight of the past.";
const image = "/images/social/lab-weight-2026-10.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/weight/" },
  openGraph: {
    title,
    description,
    url: "/weight/",
    type: "website",
    siteName: "The Lab",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
