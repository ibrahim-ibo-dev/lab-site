import type { Metadata } from "next";

const title = "The Weight of the Past | Ibrahim Hussein";
const description = "An interactive canvas experiment about momentum and memory. Move quickly to gather shadow echoes, then slow down and observe the weight of the past.";

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
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
