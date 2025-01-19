import "./globals.css";
import { Orbitron, Audiowide, Exo_2, Press_Start_2P } from "next/font/google";
import { MusicPlayerProvider } from "@/app/contexts/MusicPlayerContext";
import { MusicPlayer } from "@/components/MusicPlayer";
import { AbstraxionProviderWrapper } from "@/components/providers/AbstraxionProviderWrapper";
import { Inter } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});
const exo2 = Exo_2({ subsets: ["latin"], variable: "--font-exo2" });
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tunecraft",
  description: "Craft Your Digital Melodies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${audiowide.variable} ${exo2.variable} ${pressStart2P.variable} ${inter.className}`}
    >
      <body className={orbitron.className}>
        <AbstraxionProviderWrapper>
          <MusicPlayerProvider>
            {children}
            <MusicPlayer />
          </MusicPlayerProvider>
        </AbstraxionProviderWrapper>
      </body>
    </html>
  );
}
