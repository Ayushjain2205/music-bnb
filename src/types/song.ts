export interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  gain: number;
  data: { price: number; date: string }[];
  ticker: string;
  bondingCurve: number;
  audioUrl: string;
}
