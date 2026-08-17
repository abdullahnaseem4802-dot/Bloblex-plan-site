import PageTransition from "@/components/PageTransition";

/** A template re-mounts on every navigation, which is what lets each route
 *  animate in. Keeping it here (not in layout) preserves the shared backdrop. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
