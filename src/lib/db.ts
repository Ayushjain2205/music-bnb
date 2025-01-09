import { Song } from "@/types/song";

export const songs: Record<string, Omit<Song, "data" | "price" | "gain">> = {
  "1": {
    id: "1",
    title: "Cyber Dreams",
    artist: "Neural Beats",
    image: "/placeholder.svg?height=300&width=300",
    ticker: "$CYBER",
    bondingCurve: 85.5,
  },
  "2": {
    id: "2",
    title: "Digital Horizon",
    artist: "AI Ensemble",
    image: "/placeholder.svg?height=300&width=300",
    ticker: "$HORIZON",
    bondingCurve: 82.3,
  },
  "3": {
    id: "3",
    title: "Quantum Pulse",
    artist: "ByteBeats",
    image: "/placeholder.svg?height=300&width=300",
    ticker: "$QUANTUM",
    bondingCurve: 78.9,
  },
  "4": {
    id: "4",
    title: "Neural Symphony",
    artist: "DataFlow",
    image: "/placeholder.svg?height=300&width=300",
    ticker: "$NEURAL",
    bondingCurve: 90.2,
  },
};
