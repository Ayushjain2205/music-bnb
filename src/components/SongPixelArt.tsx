import React from "react";

interface SongPixelArtProps {
  title: string;
  artist: string;
  price: number;
}

const SongPixelArt: React.FC<SongPixelArtProps> = ({
  title,
  artist,
  price,
}) => {
  // Generate a unique color based on the input string
  const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate RGB values
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;

    return `rgb(${r}, ${g}, ${b})`;
  };

  const mainColor = generateColor(title);
  const secondaryColor = generateColor(artist);
  const accentColor = generateColor(price.toString());

  // Simple 8x8 musical note pattern
  const notePattern = [
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
  ];

  // Generate surrounding pattern based on the price
  const generateSurroundingPattern = (price: number) => {
    const pattern = Array(8)
      .fill(0)
      .map(() => Array(8).fill(0));
    const frequency = price * 10;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        // Skip if it's part of the note pattern
        if (notePattern[i][j] === 1) continue;

        // Generate pattern based on sine waves and price
        const value = Math.sin(i * frequency) + Math.cos(j * frequency);
        pattern[i][j] = value > 0 ? 1 : 0;
      }
    }

    return pattern;
  };

  const surroundingPattern = generateSurroundingPattern(price);

  return (
    <div className="w-full aspect-square bg-[#0D0D15]">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8">
        {notePattern.map((row, i) =>
          row.map((cell, j) => {
            let bgColor = "bg-gray-900";

            // Musical note (white)
            if (cell === 1) {
              bgColor = "bg-white";
            }

            // Surrounding pattern (colored)
            if (cell === 0 && surroundingPattern[i][j] === 1) {
              const colorIndex = (i + j) % 3;
              bgColor =
                colorIndex === 0
                  ? `bg-[${mainColor}]`
                  : colorIndex === 1
                  ? `bg-[${secondaryColor}]`
                  : `bg-[${accentColor}]`;
            }

            return (
              <div
                key={`${i}-${j}`}
                className={bgColor}
                style={{
                  backgroundColor: bgColor.startsWith("bg-[")
                    ? bgColor.slice(4, -1)
                    : undefined,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SongPixelArt;
