import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/song-card";

export default function Home() {
  const songs = [
    {
      id: "1",
      title: "Cyber Dreams",
      artist: "Neural Beats",
      image: "/placeholder.svg?height=64&width=64",
      price: 0.25,
      gain: 15.3,
      data: [
        { price: 0.22 },
        { price: 0.2 },
        { price: 0.23 },
        { price: 0.21 },
        { price: 0.24 },
        { price: 0.22 },
        { price: 0.25 },
      ],
    },
    {
      id: "2",
      title: "Digital Horizon",
      artist: "AI Ensemble",
      image: "/placeholder.svg?height=64&width=64",
      price: 0.09,
      gain: -5.2,
      data: [
        { price: 0.1 },
        { price: 0.11 },
        { price: 0.095 },
        { price: 0.1 },
        { price: 0.085 },
        { price: 0.09 },
        { price: 0.09 },
      ],
    },
    {
      id: "3",
      title: "Quantum Pulse",
      artist: "ByteBeats",
      image: "/placeholder.svg?height=64&width=64",
      price: 0.06,
      gain: 3.4,
      data: [
        { price: 0.058 },
        { price: 0.059 },
        { price: 0.061 },
        { price: 0.057 },
        { price: 0.062 },
        { price: 0.059 },
        { price: 0.06 },
      ],
    },
    {
      id: "4",
      title: "Neural Symphony",
      artist: "DataFlow",
      image: "/placeholder.svg?height=64&width=64",
      price: 0.18,
      gain: 22.7,
      data: [
        { price: 0.15 },
        { price: 0.16 },
        { price: 0.17 },
        { price: 0.165 },
        { price: 0.18 },
        { price: 0.175 },
        { price: 0.18 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-8">
          <h1
            className="text-2xl font-bold retro-wave-text"
            style={{
              fontFamily: "var(--font-press-start-2p)",
              letterSpacing: "0.1em",
            }}
          >
            TUNECRAFT
          </h1>
          <nav className="space-x-6">
            <Link
              href="#"
              className="text-[#FF99D1] hover:text-[#FF00FF] font-exo2"
            >
              FAQ
            </Link>
            <Link
              href="#"
              className="text-[#FF99D1] hover:text-[#FF00FF] font-exo2"
            >
              Twitter/X
            </Link>
          </nav>
        </div>
        <Button
          className="bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2"
          size="lg"
        >
          Start trading
        </Button>
      </header>

      {/* Hero */}
      <section className="text-center py-20">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 gradient-text font-audiowide">
          Make money with your AI music.
        </h2>
        <p className="text-lg md:text-xl text-[#FF99D1] font-exo2">
          Generate unreleased tracks and profit when they gain traction.
        </p>
      </section>

      {/* Song List */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="space-y-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Trading Stats */}
      <section className="text-center py-16">
        <p className="text-xl text-[#FF99D1] font-exo2">
          Over <span className="text-[#00FFFF]">$330,000</span> in Tunecraft
          songs traded.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button
            size="lg"
            className="bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2"
          >
            Start trading
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#0D0D15] font-exo2"
          >
            Launch a track
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <Button
          size="lg"
          className="bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2"
        >
          Launch your own track in 1 minute
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#FF99D1] font-exo2">
        <p>2024 © Tunecraft, Inc.</p>
      </footer>
    </div>
  );
}
