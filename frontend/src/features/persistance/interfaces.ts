import { MarkerInfo } from "../../data/interfaces";
import { Place } from "../map/interfaces";

export interface PlanPersist {
  target: string;
  preference?: string;
  originName?: string;
  originPlace?: Place;
  markers: MarkerInfo[];
  uid: string;
}

export interface PlanPersistSummary {
  uid: string;
  caption: string;
  subcaption?: string;
  photos: string[];
}
