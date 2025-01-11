"use client";

import React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";

export function MusicPlayer() {
  const { currentSong, isPlaying, togglePlayPause } = useMusicPlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1522] border-t border-[#FF00FF]/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={currentSong.image}
            alt={currentSong.title}
            width={48}
            height={48}
            className="rounded-md"
          />
          <div>
            <h3 className="text-[#00FFFF] font-bold">{currentSong.title}</h3>
            <p className="text-[#FF99D1] text-sm">{currentSong.artist}</p>
          </div>
        </div>
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-[#FF00FF] flex items-center justify-center hover:bg-[#FF66B8] transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
