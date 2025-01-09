import { Song } from "@/types/song";
import { SongView } from "@/components/song-view";
import { headers } from "next/headers";

async function getSongData(id: string): Promise<Song> {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process?.env?.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/songs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch song");
  return res.json();
}

export default async function SongPage({ params }: { params: { id: string } }) {
  const song = await getSongData(params.id);
  return <SongView song={song} />;
}
