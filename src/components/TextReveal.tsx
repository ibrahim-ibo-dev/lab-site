"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function TextReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
      animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
