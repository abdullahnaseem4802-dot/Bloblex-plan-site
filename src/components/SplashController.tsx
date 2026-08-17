"use client";
import { useEffect } from "react";

export const SPLASH_DONE = "blobex:splash-done";

/** Fades out and removes the SSR splash, then tells the page the curtain
 *  has lifted so the hero can start its reveal at exactly the right moment. */
export default function SplashController() {
  useEffect(() => {
    const html = document.documentElement;
    const w = window as unknown as { __blobexSplashDone?: boolean };

    if (!html.hasAttribute("data-splash")) {
      w.__blobexSplashDone = true;
      return;
    }

    const el = document.getElementById("blobex-splash");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let removeT: ReturnType<typeof setTimeout>;

    const lift = setTimeout(() => {
      el?.classList.add("bx-hide");
      // announce as the curtain starts lifting, so the headline types in
      // while the splash fades rather than after an awkward pause
      w.__blobexSplashDone = true;
      window.dispatchEvent(new Event(SPLASH_DONE));
      removeT = setTimeout(() => html.removeAttribute("data-splash"), 650);
    }, reduce ? 300 : 2600);

    return () => { clearTimeout(lift); clearTimeout(removeT); };
  }, []);

  return null;
}
