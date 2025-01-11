"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Song } from "@/types/song";

type MusicPlayerContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{ currentSong, isPlaying, playSong, pauseSong, togglePlayPause }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
