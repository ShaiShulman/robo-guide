export type AppMode = "Prompt" | "Loading" | "Result" | "Error";

export type TravelMode = "Walking" | "Public Transport" | "Driving";

export interface MarkerInfo {
  title: string;
  desc?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  placeId?: string;
  routeDistance?: number;
  routeDuration?: number;
  url?: string;
  selected?: boolean;
}

export interface Coord {
  lat: number;
  lng: number;
}
