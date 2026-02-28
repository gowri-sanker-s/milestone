"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          x: 80,
          opacity: 0,
          filter: "blur(8px)",
        }}
        animate={{
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={{
          x: -80,
          opacity: 0,
          filter: "blur(8px)",
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1], // smooth premium easing
        }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
