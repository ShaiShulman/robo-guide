export type AppMode = "Prompt" | "Loading" | "Result";

export type TravelMode = "Walking" | "Public Transport" | "Driving";

export interface MarkerInfo {
  title: string;
  desc?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  placeId?: string;
  route?: google.maps.DirectionsResult;
  url?: string;
  selected?: boolean;
}

export interface Coord {
  lat: number;
  lng: number;
}
