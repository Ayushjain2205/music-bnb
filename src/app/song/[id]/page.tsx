"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { ArrowLeft, Play, Pause, Share2 } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";
import { api } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import SongPixelArt from "@/components/SongPixelArt";

import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Define the type for our chart data
interface ChartData {
  date: string;
  price: number;
}

// Custom tooltip component with proper type checking
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.[0]) return null;

  const date = new Date(payload[0].payload.date);
  const value = payload[0].value as number;

  return (
    <div className="bg-[#1A1522] border border-[#333] rounded-lg p-3 shadow-lg">
      <div className="space-y-1.5">
        <div className="text-[#666] text-xs font-mono tracking-tight">
          {date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}
        </div>
        <div className="text-[#a3ffae] text-sm font-mono font-bold">
          ${value.toFixed(3)}
        </div>
      </div>
    </div>
  );
};

export default function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { currentSong, isPlaying, togglePlayPause, setCurrentSongById } =
    useMusicPlayer();
  const [amount, setAmount] = React.useState("");
  const [song, setSong] = React.useState(currentSong);

  React.useEffect(() => {
    const loadSong = async () => {
      try {
        const songData = await api.songs.getOne(resolvedParams.id);
        setSong(songData);
        await setCurrentSongById(resolvedParams.id);
      } catch (error) {
        console.error("Error loading song:", error);
      }
    };
    loadSong();
  }, [resolvedParams.id, setCurrentSongById]);

  const handlePlayPause = () => {
    if (song && song.id !== currentSong?.id) {
      setCurrentSongById(song.id).then(() => {
        togglePlayPause();
      });
    } else {
      togglePlayPause();
    }
  };

  if (!song) return null;

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white  pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-[#FF00FF] flex items-center justify-center hover:bg-[#FF66B8] transition-colors"
            >
              {isPlaying && currentSong?.id === song.id ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14">
                {currentSong && (
                  <SongPixelArt
                    title={currentSong.title}
                    artist={currentSong.artist}
                    price={currentSong.price}
                  />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#00FFFF] font-audiowide mb-1">
                  {song.title}
                </h1>
                <p className="text-[#FF99D1] font-exo2">{song.artist}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-[#0D0D15] border border-[#FF00FF]/20 rounded-lg p-6">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "rgb(163, 255, 174)",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={song.data}
                      margin={{ top: 20, right: 50, left: 0, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgb(163, 255, 174)"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="rgb(163, 255, 174)"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        tickLine={false}
                        tickFormatter={(value) => value.split("-")[2]}
                        style={{
                          fontSize: "12px",
                          fontFamily: "monospace",
                        }}
                      />
                      <YAxis
                        stroke="#666"
                        orientation="right"
                        tickFormatter={(value) => `$${value.toFixed(3)}`}
                        style={{
                          fontSize: "12px",
                          fontFamily: "monospace",
                        }}
                        domain={["dataMin - 0.01", "dataMax + 0.01"]}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                        vertical={false}
                      />
                      <ChartTooltip content={CustomTooltip} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="rgb(163, 255, 174)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: "rgb(163, 255, 174)",
                          stroke: "#0D0D15",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed songId={resolvedParams.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Song Pixel Art */}
            <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
              <div className="aspect-square mb-4"></div>
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
