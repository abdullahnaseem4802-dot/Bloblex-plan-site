"use client";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

/** Every route enters with the same lift-and-settle motion, so moving through
 *  the site reads as chapters of one story rather than separate documents. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
