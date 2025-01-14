import { Song } from "@/types/song";

const generatePriceData = (startPrice: number, days: number) => {
  const data = [];
  let currentPrice = startPrice;

  for (let i = 0; i < days; i++) {
    // Add some realistic price movements
    const change = (Math.random() - 0.45) * 0.01 * currentPrice;
    currentPrice = Math.max(0.001, currentPrice + change);

    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: parseFloat(currentPrice.toFixed(3)),
    });
  }

  return data;
};

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Cyber Dreams",
    artist: "Neural Beats",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-11%20at%207.56.45%E2%80%AFAM-8Mp4TeEjhrlAB3q3qRKXY16VmVt5Ex.png",
    price: 0.328,
    gain: 15.3,
    ticker: "$CYBER",
    bondingCurve: 85.5,
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    data: generatePriceData(0.25, 30),
  },
  {
    id: "2",
    title: "Digital Horizon",
    artist: "AI Ensemble",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-11%20at%207.56.45%E2%80%AFAM-8Mp4TeEjhrlAB3q3qRKXY16VmVt5Ex.png",
    price: 0.18,
    gain: -5.2,
    ticker: "$DIGI",
    bondingCurve: 62.7,
    audioUrl:
      "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3",
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 0.2 + Math.random() * 0.15,
    })),
  },
];

export const api = {
  songs: {
    getAll: async (): Promise<Song[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSongs;
    },
    getOne: async (id: string): Promise<Song> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const song = mockSongs.find((s) => s.id === id);
      if (!song) {
        console.warn(`Song with id ${id} not found. Returning a default song.`);
        return {
          id: "1",
          title: "Cyber Dreams",
          artist: "Neural Beats",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-11%20at%207.56.45%E2%80%AFAM-8Mp4TeEjhrlAB3q3qRKXY16VmVt5Ex.png",
          price: 0.328,
          gain: 15.3,
          ticker: "$CYBER",
          bondingCurve: 85.5,
          audioUrl:
            "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          data: generatePriceData(0.25, 30),
        };
      }
      return song;
    },
  },
};
