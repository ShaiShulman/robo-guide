export type AppMode = "Prompt" | "Loading" | "Result" | "Error";

// export type TravelMode = "Walking" | "Transit" | "Driving" | "Bicycling";

export const TravelMode = {
  Walking: "Walking",
  Transit: "Transit",
  Driving: "Driving",
  Bicycling: "Bicycling",
} as const;

export type TravelModeType = typeof TravelMode[keyof typeof TravelMode];

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
