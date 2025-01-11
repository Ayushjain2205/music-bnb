"use client";

import React from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";
import { formatTime } from "@/lib/utils";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    playNextSong,
    playPreviousSong,
    seekTo,
    setVolume,
  } = useMusicPlayer();

  const [isMuted, setIsMuted] = React.useState(false);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const newVolume = (e.clientX - rect.left) / rect.width;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(volume || 1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#1A1522] border-t border-[#FF00FF]/20 px-4">
      <div className="max-w-7xl mx-auto h-full">
        <div
          className="absolute left-0 right-0 -top-1 h-1 bg-[#1A1522] cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-[#00FFFF] via-[#FF99D1] to-[#FF00FF]"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <button
                className="text-[#FF99D1] hover:text-[#FF00FF] transition-colors"
                onClick={playPreviousSong}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="text-[#FF99D1] hover:text-[#FF00FF] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                className="text-[#FF99D1] hover:text-[#FF00FF] transition-colors"
                onClick={playNextSong}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[#FF99D1] text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="flex items-center gap-3 max-w-[300px] w-full">
              <Image
                src={currentSong.image}
                alt={currentSong.title}
                width={50}
                height={50}
                className="rounded"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[#00FFFF] font-bold text-sm truncate">
                  {currentSong.title}
                </h3>
                <p className="text-[#FF99D1] text-xs truncate">
                  {currentSong.artist}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={toggleMute}
              className="text-[#FF99D1] hover:text-[#FF00FF] transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div
              className="w-24 h-1 bg-[#1A1522] rounded-full overflow-hidden cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
