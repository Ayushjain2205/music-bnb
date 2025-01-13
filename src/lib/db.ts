import { Song } from "@/types/song";

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Cyber Dreams",
    artist: "Neural Beats",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.25,
    gain: 15.3,
    ticker: "$CYBER",
    bondingCurve: 85.5,
    audioUrl:
      "https://replicate.delivery/pbxt/A5YyaCqTaHISE95OBhNRQHPo8o1diboZhAzGQpkfN0EggniJA/out.wav",
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 0.15 + Math.random() * 0.2,
    })),
  },
  {
    id: "2",
    title: "Digital Horizon",
    artist: "AI Ensemble",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.18,
    gain: -5.2,
    ticker: "$DIGI",
    bondingCurve: 62.7,
    audioUrl:
      "https://replicate.delivery/pbxt/A5YyaCqTaHISE95OBhNRQHPo8o1diboZhAzGQpkfN0EggniJA/out.wav",
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 0.2 + Math.random() * 0.15,
    })),
  },
  // Add more mock songs as needed
];

export const api = {
  songs: {
    getAll: async (): Promise<Song[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSongs;
    },
    getOne: async (id: string): Promise<Song> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const song = mockSongs.find((s) => s.id === id);
      if (!song) throw new Error("Song not found");
      return song;
    },
  },
};
