import { Directions } from "./interfaces";
import { Coord, TravelModeType } from "../../data/interfaces";
import { getRouteObjects } from "./map-utils";
import { MarkerInfo } from "../../data/interfaces";

export const updateDirections = async (
  markers: MarkerInfo[],
  directions: Directions,
  travelMode: TravelModeType,
  origin: Coord,
  startIndex: number
) => {
  if (
    Object.entries(directions)
      .filter(([key]) => parseInt(key) > startIndex)
      .map(([key, record]) => record[travelMode])
      .every((value) => !value)
  ) {
    const newDirections = { ...directions };
    const routes = await getRouteObjects(
      origin,
      markers.map((m) => ({ lat: m.lat, lng: m.lng })),
      travelMode
    );

    for (const marker of markers) {
      if (!newDirections[markers.indexOf(marker) + startIndex]) {
        newDirections[markers.indexOf(marker) + startIndex] = {
          Driving: null,
          Walking: null,
          Bicycling: null,
          Transit: null,
        };
      }
      newDirections[markers.indexOf(marker) + startIndex][travelMode] =
        routes[markers.indexOf(marker)];
    }

    return newDirections;
  } else return directions;
};
