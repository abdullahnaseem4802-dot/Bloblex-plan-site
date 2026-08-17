/* Blobex brand lockup, official transparent mark + wordmark.
   Dark wordmark on light surfaces (header), white wordmark on dark (footer/splash). */
export default function BrandLogo({ dark = false, size = 40 }: { dark?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/img/brand/mark.png" alt="" aria-hidden style={{ height: size, width: "auto" }} className="object-contain" />
      <img
        src={dark ? "/img/brand/wordmark.png" : "/img/brand/wordmark-dark.png"}
        alt="Blobex" style={{ height: size * 0.52, width: "auto" }} className="object-contain"
      />
    </span>
  );
}
