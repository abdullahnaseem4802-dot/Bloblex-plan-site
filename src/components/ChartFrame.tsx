/* Shared chart chrome: faint gridlines + arrowed X/Y axes + axis titles.
   Conceptual charts (no fabricated numbers), just structure so they read as real charts.
   Standard plot area inside a 360x240 viewBox: x 54..330, y 28..190. */
export const PLOT = { x0: 54, y0: 28, x1: 330, y1: 190 } as const;

export function ChartFrame({ yLabel, xLabel, lowHigh = true }: { yLabel: string; xLabel: string; lowHigh?: boolean }) {
  const { x0, y0, x1, y1 } = PLOT;
  const grid = [0.25, 0.5, 0.75].map((f) => y1 - f * (y1 - y0));
  return (
    <g>
      <defs>
        <marker id="cf-arrow" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
          <path d="M1 1 L7 4.5 L1 8" fill="none" stroke="var(--color-mute)" strokeWidth="1.4" />
        </marker>
      </defs>
      {/* gridlines */}
      {grid.map((y, i) => (
        <line key={i} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 6" />
      ))}
      {/* axes */}
      <line x1={x0} y1={y1} x2={x0} y2={y0 - 4} stroke="var(--color-mute)" strokeWidth="1.5" markerEnd="url(#cf-arrow)" />
      <line x1={x0} y1={y1} x2={x1 + 4} y2={y1} stroke="var(--color-mute)" strokeWidth="1.5" markerEnd="url(#cf-arrow)" />
      {/* origin */}
      <circle cx={x0} cy={y1} r="2.5" fill="var(--color-mute)" />
      {/* qualitative scale */}
      {lowHigh && (
        <>
          <text x={x0 - 8} y={y0 + 6} textAnchor="end" fontSize="9" fill="var(--color-mute)">High</text>
          <text x={x0 - 8} y={y1} textAnchor="end" fontSize="9" fill="var(--color-mute)">Low</text>
        </>
      )}
      {/* titles */}
      <text x={16} y={(y0 + y1) / 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-slate)" transform={`rotate(-90 16 ${(y0 + y1) / 2})`}>{yLabel}</text>
      <text x={(x0 + x1) / 2} y={224} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-slate)">{xLabel}</text>
    </g>
  );
}
