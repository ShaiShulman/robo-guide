import { Directions } from "./interfaces";
import { Coord, TravelMode } from "../../globals/interfaces";
import { getRouteObjects } from "./map-utils";
import { MarkerInfo } from "../../globals/interfaces";

export const updateDirections = async (
  markers: MarkerInfo[],
  directions: Directions,
  travelMode: TravelMode,
  origin: Coord
) => {
  if (
    Object.values(directions)
      .map((record) => record[travelMode])
      .every((value) => value === null)
  ) {
    const newDirections = { ...directions };
    const routes = await getRouteObjects(
      origin,
      markers.map((m) => ({ lat: m.lat, lng: m.lng })),
      travelMode
    );

    for (const marker of markers) {
      if (!newDirections[markers.indexOf(marker)]) {
        newDirections[markers.indexOf(marker)] = {
          Driving: null,
          Walking: null,
          Bicycling: null,
          Transit: null,
        };
      }
      newDirections[markers.indexOf(marker)][travelMode] =
        routes[markers.indexOf(marker)];
    }

    return newDirections;
  } else return directions;
};
