import localFont from "next/font/local";

// Each font needs to be properly loaded with error handling
export const font1 = localFont({
  src: "./fonts/Outrun-Regular.woff2",
  variable: "--font-outrun",
  preload: true,
  display: "swap",
});

export const font2 = localFont({
  src: "./fonts/Cyberpunks-Regular.woff2",
  variable: "--font-cyberpunks",
  preload: true,
  display: "swap",
});

export const font3 = localFont({
  src: "./fonts/NeonMachine-Regular.woff2",
  variable: "--font-neon-machine",
  preload: true,
  display: "swap",
});

export const font4 = localFont({
  src: "./fonts/LaserCorp-Regular.woff2",
  variable: "--font-laser",
  preload: true,
  display: "swap",
});

export const font5 = localFont({
  src: "./fonts/SynthRave-Regular.woff2",
  variable: "--font-synthrave",
  preload: true,
  display: "swap",
});
