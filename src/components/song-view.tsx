"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowLeft, Play, Pause, Share2 } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useState } from "react";
import { Song } from "@/types/song";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";

export function SongView({ song }: { song: Song }) {
  const { currentSong, isPlaying, playSong, pauseSong } = useMusicPlayer();
  const [amount, setAmount] = useState("");

  const isSongPlaying = isPlaying && currentSong?.id === song.id;

  const handlePlayPause = () => {
    if (isSongPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-[#FF00FF] flex items-center justify-center hover:bg-[#FF66B8] transition-colors"
            >
              {isSongPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#00FFFF] font-audiowide mb-1">
                {song.title}
              </h1>
              <p className="text-[#FF99D1] font-exo2">{song.artist}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={song.data}>
                    <XAxis
                      dataKey="date"
                      stroke="#FF99D1"
                      tickFormatter={(value) => value.split("-")[2]}
                    />
                    <YAxis
                      stroke="#FF99D1"
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1A1522",
                        border: "1px solid rgba(255, 0, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#FF99D1" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#00FFFF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed songId={song.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Song Image */}
            <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
              <div className="relative aspect-square mb-4">
                <Image
                  src={song.image}
                  alt={song.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Button
                className="w-full bg-zinc-800 text-white hover:bg-zinc-700 font-exo2"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Make Meme
              </Button>
            </div>

            {/* Trading Interface */}
            <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
              <div className="flex justify-between mb-6">
                <Button className="flex-1 bg-[#00FFFF] text-[#0D0D15] hover:bg-[#66FFFF] font-exo2">
                  Buy
                </Button>
                <Button className="flex-1 ml-2 bg-transparent border border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-white font-exo2">
                  Sell
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#FF99D1] mb-2 font-exo2">
                    Amount (ETH)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    placeholder="0.0"
                  />
                </div>
                <Button className="w-full bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2">
                  Place Trade
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#FF99D1] font-exo2">Ticker:</span>
                  <span className="text-white font-mono">{song.ticker}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#FF99D1] font-exo2">Price:</span>
                  <span className="text-white font-mono">
                    ${song.price.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#FF99D1] font-exo2">
                    Bonding curve filled:
                  </span>
                  <span className="text-white font-mono">
                    {song.bondingCurve}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
