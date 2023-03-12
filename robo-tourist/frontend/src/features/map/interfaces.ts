export interface MarkerProps {
  title: string;
  desc?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  placeId?: string;
  route?: google.maps.DirectionsResult;
  selected?: boolean;
}

export interface Coord {
  lat: number;
  lng: number;
}

export type TravelMode = "Walking" | "Transit" | "Driving";
