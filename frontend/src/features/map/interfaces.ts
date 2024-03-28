import { MarkerInfo, TravelModeType } from "../../data/interfaces";

export interface Place {
  lat: number;
  lng: number;
  placeId: string;
}

export interface MarkerWithDirections extends MarkerInfo {
  directions?: MarkerDirections;
}

export type MarkerDirections = Record<
  TravelModeType,
  google.maps.DirectionsResult | null
>;

export type Directions = Record<number, MarkerDirections>;

export interface PlaceDetailsResponse {
  photo?: string;
  website?: string;
  rating?: number;
}
