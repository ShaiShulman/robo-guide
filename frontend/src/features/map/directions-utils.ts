import { Directions } from "./interfaces";
import { Coord, TravelModeType } from "../../data/interfaces";
import { getRouteObjects } from "./map-utils";
import { MarkerInfo } from "../../data/interfaces";

export const updateDirections = async (
  markerLocs: Coord[],
  directions: Directions,
  travelMode: TravelModeType,
  origin: Coord,
  startIndex: number
) => {
  const routes = await getRouteObjects(origin, markerLocs, travelMode);

  const newDirections = routes.reduce((acc, route, index) => {
    if (route) {
      if (acc[index + startIndex]) acc[index + startIndex][travelMode] = route;
      else acc[index + startIndex] = { [travelMode]: route };
    }
    return acc;
  }, JSON.parse(JSON.stringify(directions)));

  return newDirections;
};
