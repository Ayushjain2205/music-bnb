import { Song } from "@/types/song";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  songs: {
    getAll: () => fetchApi<Song[]>("/songs"),
    getOne: (id: string) => fetchApi<Song>(`/songs/${id}`),
  },
};
