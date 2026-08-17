import SplashController from "./SplashController";

/* Startup splash, rendered in the SERVER HTML so it covers the page from the
   very first paint (no flash of content first). A tiny inline script decides,
   BEFORE paint, whether to show it: on a fresh open or a reload, but NOT on
   internal navigation (e.g. clicking "Home"). */
const DECIDE = `try{
  var r=document.referrer,same=false;
  try{same=!!r&&new URL(r).origin===location.origin;}catch(e){}
  var n=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]);
  var reload=n&&n.type==='reload';
  if(reload||!same){document.documentElement.setAttribute('data-splash','');}
}catch(e){}`;

export default function Splash() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DECIDE }} />
      <div id="blobex-splash" aria-hidden="true">
        <span className="bx-splash-glow" />
        <img src="/img/brand/logo.png" alt="Blobex" width={460} height={258} />
        <span className="bx-splash-shimmer" />
      </div>
      <SplashController />
    </>
  );
}
