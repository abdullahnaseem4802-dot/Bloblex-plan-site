import { Inter, Space_Grotesk } from "next/font/google";

export const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const display = Space_Grotesk({
  subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700"],
});
export const fontVars = `${sans.variable} ${display.variable}`;
