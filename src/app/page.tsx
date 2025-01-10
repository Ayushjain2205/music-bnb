import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/song-card";
import { Navbar } from "@/components/navbar";
import { api } from "@/lib/api";

export default async function Home() {
  const songs = await api.songs.getAll();

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white">
      <Navbar />

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
