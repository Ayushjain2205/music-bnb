"use client";

import React, { useRef, useEffect, useState } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
}

export function AudioVisualizer({ audioElement }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioElement) {
      console.log("AudioVisualizer: Waiting for audio element");
      return;
    }
    if (!canvasRef.current) {
      console.error("AudioVisualizer: No canvas element found");
      setError("No canvas element");
      return;
    }

    console.log("AudioVisualizer: Setting up audio context");

    const setupAudioContext = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }

        if (!sourceNodeRef.current) {
          sourceNodeRef.current =
            audioContextRef.current.createMediaElementSource(audioElement);
        }

        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          sourceNodeRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      } catch (err) {
        console.error("Error setting up audio context:", err);
        setError(`Error setting up audio context: ${err}`);
        return false;
      }
      return true;
    };

    if (!setupAudioContext()) return;

    const analyser = analyserRef.current!;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;

    console.log("AudioVisualizer: Starting draw loop");
    let animationFrameId: number;

    function draw() {
      animationFrameId = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear with a semi-transparent background for trail effect
      ctx.fillStyle = "rgba(13, 13, 21, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Calculate color based on frequency and height
        const progress = i / bufferLength;
        let color;
        if (progress < 0.33) {
          // Gradient from cyan to pink
          color = `rgb(${Math.floor(255 * (progress * 3))}, ${Math.floor(
            255 - progress * 255
          )}, ${255})`;
        } else if (progress < 0.66) {
          // Gradient from pink to magenta
          color = `rgb(255, ${Math.floor(
            153 + (progress - 0.33) * 3 * 102
          )}, ${Math.floor(209 + (progress - 0.33) * 3 * 46)})`;
        } else {
          // Gradient to magenta
          color = `rgb(255, 0, ${Math.floor(255 * ((progress - 0.66) * 3))})`;
        }

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        ctx.fillStyle = color;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Reset shadow for next iteration
        ctx.shadowBlur = 0;

        x += barWidth + 1;
      }
    }

    draw();

    return () => {
      console.log("AudioVisualizer: Cleaning up");
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioElement]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className="w-full bg-[#1A1522]"
    />
  );
}
