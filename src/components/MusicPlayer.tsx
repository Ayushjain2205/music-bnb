"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";
import { AudioVisualizer } from "./AudioVisualizer";
import { Slider } from "@/components/ui/slider";

export function MusicPlayer() {
  const { currentSong, isPlaying, togglePlayPause } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioRef.current) {
        console.log("MusicPlayer: Creating new Audio element");
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audioRef.current = audio;
      }
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        console.log("MusicPlayer: Cleaning up Audio element");
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      console.log(`MusicPlayer: Loading song - ${currentSong.title}`);
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        console.log("MusicPlayer: Attempting to play audio");
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback failed:", error);
            setError(
              `Playback failed: ${error.message}. Try clicking play again.`
            );
          });
        }
      } else {
        console.log("MusicPlayer: Pausing audio");
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1522] border-t border-[#FF00FF]/20 p-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full mb-2">
          {error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <AudioVisualizer audioElement={audioRef.current} />
          )}
        </div>
        <div className="w-full flex items-center justify-between">
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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
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
              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
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
      </div>
    </div>
  );
}
