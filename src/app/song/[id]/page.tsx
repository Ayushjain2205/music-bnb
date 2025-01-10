import { Song } from "@/types/song";
import { SongView } from "@/components/song-view";
import { Navbar } from "@/components/navbar";
import { api } from "@/lib/api";

export default async function SongPage({ params }: { params: { id: string } }) {
  const song = await api.songs.getOne(params.id);

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white">
      <Navbar />
      <SongView song={song} />
    </div>
  );
}
