export type AppMode =
  | "Prompt"
  | "Loading"
  | "LoadingProgressive"
  | "Result"
  | "Error";

// export type TravelMode = "Walking" | "Transit" | "Driving" | "Bicycling";

export const TravelMode = {
  Driving: "Driving",
  Walking: "Walking",
  Transit: "Transit",
  Bicycling: "Bicycling",
} as const;

export type TravelModeType = (typeof TravelMode)[keyof typeof TravelMode];

export interface MarkerInfo {
  title: string;
  desc?: string;
  lat: number;
  lng: number;
  photo?: string;
  placeId?: string;
  routeDistance?: number;
  routeDuration?: number;
  website?: string;
  rating?: number;
  selected?: boolean;
}

export interface Coord {
  lat: number;
  lng: number;
}
