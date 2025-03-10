"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Play, Pause } from "lucide-react";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";
import { Song } from "@/types/song";
import SongPixelArt from "./SongPixelArt";

function generateStableHash(id: string) {
  const hash = id.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) >>> 0;
  }, 0);
  return hash.toString(16).substring(0, 4);
}

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  const { currentSong, isPlaying, togglePlayPause, setCurrentSongById } =
    useMusicPlayer();
  const isPositive = song.gain >= 0;
  const gainColor = isPositive ? "text-[#00FFFF]" : "text-[#FF0000]";
  const displayId = `0x${song.id.padStart(4, "0")}...${generateStableHash(
    song.id
  )}`;

  const isSongPlaying = isPlaying && currentSong?.id === song.id;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setCurrentSongById(song.id).then(() => {
        togglePlayPause();
      });
    }
  };

  return (
    <div className="bg-[#1A1522] border border-[#FF00FF]/20 p-4 hover:border-[#FF00FF]/40 transition-colors rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <SongPixelArt
              title={song.title}
              artist={song.artist}
              price={song.price}
            />
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
            >
              {isSongPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
          <div>
            <Link href={`/song/${encodeURIComponent(song.id)}`}>
              <h3 className="font-bold text-[#00FFFF] font-audiowide hover:text-[#66FFFF] transition-colors">
                {song.title}
              </h3>
            </Link>
            <p className="text-sm text-[#FF99D1] font-exo2">{displayId}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="w-24 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={song.data}>
                <YAxis domain={["dataMin", "dataMax"]} hide />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#00FFFF" : "#FF0000"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-right">
            <div className="font-mono text-[#FF00FF]">
              ${song.price.toFixed(2)}
            </div>
            <div className={`font-exo2 ${gainColor}`}>
              {isPositive ? "+" : ""}
              {song.gain.toFixed(1)}%
            </div>
          </div>
          <Button className="bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2">
            Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
