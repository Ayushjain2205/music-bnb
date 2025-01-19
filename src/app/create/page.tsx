"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import SongPixelArt from "@/components/SongPixelArt";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useMusicPlayer } from "@/app/contexts/MusicPlayerContext";
import { Loader2, Play, Pause, Share2, Zap, Rocket } from "lucide-react";
import { useMusicToken } from "@/hooks/useMusicToken";
import { useWallet } from "@/hooks/useWallet";

const genres = [
  "Synthwave",
  "Cyberpunk",
  "Vaporwave",
  "Chiptune",
  "Darksynth",
  "Retrowave",
];
const moods = [
  "Energetic",
  "Melancholic",
  "Dreamy",
  "Intense",
  "Relaxed",
  "Mysterious",
];

export default function CreatePage() {
  const [songTitle, setSongTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [duration, setDuration] = useState(60);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentSong, isPlaying, togglePlayPause, setCurrentSongById } =
    useMusicPlayer();
  const { createMusicToken, loading: tokenLoading } = useMusicToken();
  const { address } = useWallet();
  const [price, setPrice] = useState(0.001); // Initial price in ETH

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement actual AI generation here
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating generation time
    const audioUrl = "/placeholder-audio.mp3"; // Replace with actual generated audio
    setGeneratedAudio(audioUrl);
    setIsGenerating(false);

    // Set the generated song as the current song in the music player
    setCurrentSongById("generated-song-id");
  };

  useEffect(() => {
    // Update the music player context when a new song is generated
    if (generatedAudio) {
      setCurrentSongById("generated-song-id");
    }
  }, [generatedAudio, setCurrentSongById]);

  const getTicker = (title: string) => {
    return `$${title.replace(/\s+/g, "").slice(0, 4).toUpperCase()}`;
  };

  const handleDeploy = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // First, upload metadata to IPFS or your preferred storage
      const metadata = {
        title: songTitle,
        description: prompt,
        genre,
        mood,
        duration,
        audioUrl: generatedAudio,
      };

      // Replace with your actual metadata storage logic
      const metadataUri = await uploadMetadata(metadata);

      // Create music token
      const initialPriceWei = ethers.utils
        .parseEther(price.toString())
        .toString();
      await createMusicToken(songTitle, initialPriceWei, metadataUri);

      // Handle success
      alert("Song successfully deployed as a music token!");
    } catch (error) {
      console.error("Failed to deploy song:", error);
      alert("Failed to deploy song. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D15] text-white pb-24">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#00FFFF] font-audiowide mb-4">
            Craft Your AI Tune
          </h1>
          <p className="text-xl text-[#FF99D1] font-exo2">
            Transform your ideas into unique AI-generated music
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label
                htmlFor="songTitle"
                className="block text-lg font-medium text-[#FF99D1] mb-2"
              >
                Song Title
              </label>
              <Input
                id="songTitle"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="Enter your song title..."
                className="w-full bg-[#1A1522] border-[#FF00FF] text-white"
              />
            </div>

            <div>
              <label
                htmlFor="prompt"
                className="block text-lg font-medium text-[#FF99D1] mb-2"
              >
                Song Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Describe your song idea..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#1A1522] border-[#FF00FF] text-white h-32"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-[#FF99D1] mb-2">
                Genre
              </label>
              <div className="grid grid-cols-3 gap-2">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`p-2 rounded-md text-sm font-medium ${
                      genre === g
                        ? "bg-[#FF00FF] text-white"
                        : "bg-[#1A1522] text-[#FF99D1] hover:bg-[#FF00FF]/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-[#FF99D1] mb-2">
                Mood
              </label>
              <div className="grid grid-cols-3 gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`p-2 rounded-md text-sm font-medium ${
                      mood === m
                        ? "bg-[#00FFFF] text-[#0D0D15]"
                        : "bg-[#1A1522] text-[#00FFFF] hover:bg-[#00FFFF]/20"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-lg font-medium text-[#FF99D1] mb-2"
              >
                Duration
              </label>
              <Slider
                id="duration"
                min={30}
                max={180}
                step={10}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                className="w-full"
              />
              <span className="text-sm text-[#FF99D1] mt-1">
                {duration} seconds
              </span>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#FF00FF] text-white hover:bg-[#FF66B8] text-lg py-6"
            >
              {isGenerating
                ? "Generating..."
                : generatedAudio
                ? "Regenerate"
                : "Generate AI Song"}
            </Button>
          </div>

          <div className="space-y-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-[#FF00FF] rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 bg-[#FF00FF] rounded-full opacity-30 animate-pulse"></div>
                  <Loader2 className="w-32 h-32 text-[#FF00FF] animate-spin" />
                </div>
                <p className="text-xl font-bold text-[#00FFFF] font-audiowide">
                  Crafting Your Masterpiece...
                </p>
                <p className="text-[#FF99D1] font-exo2">
                  Our AI is composing your unique tune
                </p>
              </div>
            ) : generatedAudio ? (
              <div className="bg-gradient-to-br from-[#1A1522] to-[#2A2532] p-6 rounded-lg shadow-lg border border-[#FF00FF]/20 hover:border-[#FF00FF]/40 transition-all transform hover:scale-[1.02]">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-32 h-32 relative group">
                    <SongPixelArt title={songTitle} artist="AI" price={0} />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-[#00FFFF] transition-colors"
                      >
                        {isPlaying &&
                        currentSong?.id === "generated-song-id" ? (
                          <Pause className="w-12 h-12" />
                        ) : (
                          <Play className="w-12 h-12" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#FF99D1] font-audiowide mb-1">
                      {songTitle || "Untitled"}
                    </h3>
                    <p className="text-[#00FFFF] font-exo2 text-lg">
                      {genre || "No genre selected"}
                    </p>
                    <p className="text-[#FF00FF] font-mono text-xl mt-2">
                      {getTicker(songTitle || "SONG")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="text-[#FF00FF] w-5 h-5" />
                      <p className="text-[#FF99D1] font-exo2">
                        {duration} seconds
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-white"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button
                    onClick={handleDeploy}
                    disabled={tokenLoading}
                    className="w-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-[#0D0D15] hover:from-[#66FFFF] hover:to-[#FF66B8] font-exo2 text-lg py-4 flex items-center justify-center"
                  >
                    {tokenLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6 mr-2" />
                        Deploy Song
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 relative group">
                    <SongPixelArt
                      title="Your Next Hit"
                      artist="You"
                      price={0}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="w-12 h-12 text-[#00FFFF]" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#00FFFF] font-audiowide mb-2">
                    Your AI Masterpiece Awaits
                  </p>
                  <p className="text-[#FF99D1] font-exo2">
                    Fill in the details and generate your unique AI song
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
}
