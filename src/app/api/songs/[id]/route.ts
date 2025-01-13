import { mockSongs } from "@/lib/db";
import { NextResponse } from "next/server";

function generatePriceData(id: string) {
  const basePrice = Number(id) * 0.05 + 0.1;
  const data = Array.from({ length: 30 }, (_, i) => {
    const dayOffset = i * 0.01;
    const variation = Math.sin(i * 0.5) * 0.05;
    return {
      date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
      price: basePrice + dayOffset + variation,
    };
  });

  return data;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const songId = parseInt(params.id);
  const song = mockSongs[songId];

  if (!song) {
    return new NextResponse("Not found", { status: 404 });
  }

  const priceData = generatePriceData(params.id);
  const currentPrice = priceData[priceData.length - 1].price;
  const initialPrice = priceData[0].price;
  const gain = ((currentPrice - initialPrice) / initialPrice) * 100;

  return NextResponse.json({
    ...song,
    price: currentPrice,
    gain,
    data: priceData,
  });
}
