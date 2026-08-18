"use client";
import { useId } from "react";

/* Shared chart chrome: faint gridlines + arrowed X/Y axes + axis titles.
   Conceptual charts (no fabricated numbers), just structure so they read as real charts.
   Standard plot area inside a 360x240 viewBox: x 54..330, y 28..190. */
export const PLOT = { x0: 54, y0: 28, x1: 330, y1: 190 } as const;

export function ChartFrame({ yLabel, xLabel, lowHigh = true }: { yLabel: string; xLabel: string; lowHigh?: boolean }) {
  /* both charts sit on the same page, so the arrow marker needs its own id
     per instance or the second one references the first one's marker */
  const arrow = `cf-arrow-${useId().replace(/[:]/g, "")}`;
  const { x0, y0, x1, y1 } = PLOT;
  const grid = [0.25, 0.5, 0.75].map((f) => y1 - f * (y1 - y0));
  return (
    <g>
      <defs>
        <marker id={arrow} markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
          <path d="M1 1 L7 4.5 L1 8" fill="none" stroke="#1c2b40" strokeWidth="2" />
        </marker>
      </defs>
      {/* gridlines */}
      {grid.map((y, i) => (
        <line key={i} x1={x0} y1={y} x2={x1} y2={y} stroke="#e7ecf3" strokeWidth="1.2" strokeDasharray="3 5" />
      ))}
      {/* axes */}
      <line x1={x0} y1={y1} x2={x0} y2={y0 - 4} stroke="#1c2b40" strokeWidth="2.6" markerEnd={`url(#${arrow})`} />
      <line x1={x0} y1={y1} x2={x1 + 4} y2={y1} stroke="#1c2b40" strokeWidth="2.6" markerEnd={`url(#${arrow})`} />
      {/* origin */}
      <circle cx={x0} cy={y1} r="3" fill="#1c2b40" />
      {/* qualitative scale */}
      {lowHigh && (
        <>
          <text x={x0 - 10} y={y0 + 14} textAnchor="end" fontSize="9" fill="#8a94a8">High</text>
          <text x={x0 - 10} y={y1 - 1} textAnchor="end" fontSize="9" fill="#8a94a8">Low</text>
        </>
      )}
      {/* titles */}
      <text x={16} y={(y0 + y1) / 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#55617a" transform={`rotate(-90 16 ${(y0 + y1) / 2})`}>{yLabel}</text>
      <text x={(x0 + x1) / 2} y={224} textAnchor="middle" fontSize="11" fontWeight="700" fill="#55617a">{xLabel}</text>
    </g>
  );
}
