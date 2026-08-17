/** The Blobex blob mark, used in header + footer. Pure SVG, no JS. */
export default function BlobMark({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 48" width={size} height={(size * 48) / 64} role="img" aria-label="Blobex">
      <defs>
        <radialGradient id="bmGrad" cx="42%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#7fd4f5" />
          <stop offset="55%" stopColor="#29abe2" />
          <stop offset="100%" stopColor="#1787c4" />
        </radialGradient>
      </defs>
      <path fill="url(#bmGrad)" d="M32 3C18 3 5 13 5 27c0 10 9 16 27 16s27-6 27-16C59 13 46 3 32 3Z" />
      <circle cx="24" cy="25" r="3.6" fill="#0a1628" />
      <circle cx="40" cy="25" r="3.6" fill="#0a1628" />
      <circle cx="22.7" cy="23.7" r="1.2" fill="#fff" />
      <circle cx="38.7" cy="23.7" r="1.2" fill="#fff" />
    </svg>
  );
}
