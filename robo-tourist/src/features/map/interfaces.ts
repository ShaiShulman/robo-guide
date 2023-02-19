export interface MarkerProps {
  text: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  placeId?: string;
}

export interface Coord {
  lat: number;
  lng: number;
}
