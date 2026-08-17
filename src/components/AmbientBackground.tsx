"use client";
import { useEffect, useState } from "react";

/** A single living backdrop shared by every page. Because it is fixed and
 *  never unmounts between routes, the whole site reads as one continuous
 *  space rather than a set of separate pages. */
export default function AmbientBackground() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className="bx-ambient" aria-hidden="true" data-ready={ready ? "" : undefined}>
      <span className="bx-orb bx-orb-1" />
      <span className="bx-orb bx-orb-2" />
      <span className="bx-orb bx-orb-3" />
      <span className="bx-grain" />
    </div>
  );
}
