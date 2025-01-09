export interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  gain: number;
  ticker: string;
  bondingCurve: number;
  data: {
    date: string;
    price: number;
  }[];
}
