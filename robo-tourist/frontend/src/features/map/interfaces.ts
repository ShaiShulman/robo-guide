import { MarkerInfo, TravelModeType } from "../../globals/interfaces";

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
