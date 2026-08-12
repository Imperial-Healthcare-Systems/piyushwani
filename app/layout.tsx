import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import SiteHeader from "@/components/SiteHeader";

import "./globals.css";
import "./motion.css";
import "./refine.css";
/* Last, so the footer's own rules win over anything the ported stylesheets
   left behind for the old markup. */
import "./footer.css";

/* Runs before first paint, so revealed content is never briefly visible and
   then snatched away. Motion is opt-in: without this attribute the CSS holds
   nothing back. The failsafe un-hides everything if the motion bundle never
   arrives; Motion clears it on mount. */
const MOTION_BOOT = `(function(){try{
var d=document.documentElement;
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.setAttribute('data-motion','on');
window.__pwMotionFailsafe=setTimeout(function(){d.removeAttribute('data-motion')},4000);
}catch(e){}})();`;

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Piyushwani (OPC) Private Limited — Pharmaceutical Marketing with Batch-Level Verification",
  description:
    "Pharmaceutical marketing company offering products with QR-based batch verification. ISO 9001 certified; CDSCO drug licence and FSSAI (nutraceuticals) per product category. Verify any batch instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* MOTION_BOOT below runs before React hydrates and writes data-motion
       onto this element, so the server HTML and the client DOM differ here by
       design. suppressHydrationWarning applies to this element's own
       attributes only — it does not reach into the tree — which is exactly
       the scope of the difference. Removing the attribute instead would mean
       setting it after hydration, and revealed content would flash into view
       and then be snatched back. */
    <html
      lang="en-IN"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
