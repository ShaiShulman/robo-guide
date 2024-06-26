import { DISTANCE_TRAVEL_DAY, DISTANCE_TRAVEL_TIME } from "./const";
import { Coord, TravelModeType } from "../../data/interfaces";
import { PlaceDetailsResponse } from "./interfaces";

export const getPlace = (
  placeName: string,
  target: string,
  geocoder: any
): any => {
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      {
        address: placeName.includes(target.trim())
          ? placeName
          : placeName + "," + target,
      },
      (results, status) => {
        if (status === "OK") {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            id: results[0].place_id,
          });
        } else {
          reject(status);
        }
      }
    );
  });
};

export const getBounds = (markers: Coord[]) => {
  const bounds = new window.google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
  });
  return bounds;
};

export const getPlaceDetailsPhoto = async (
  placeId: string,
  map: google.maps.Map
): Promise<PlaceDetailsResponse> => {
  return new Promise((resolve, reject) => {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: ["name", "geometry", "photos", "website", "rating"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK)
          reject(new Error("No details found for this place."));
        const photoUrl =
          place?.photos &&
          place?.photos.length &&
          (place.photos[0] as any).getUrl();
        resolve({
          photo: photoUrl,
          website: place.website,
          rating: place.rating,
        });
      }
    );
  });
};

export const splitPlaceName = (place: string) => {
  const SPLIT_CHARS = /(–\s)|(:\s)|(-\s)/;
  const parts = place.split(SPLIT_CHARS, 2);
  return parts.length === 1
    ? [parts[0], ""]
    : [parts[0], place.slice(parts[0].length + 1)];
};

export const numberedMarker = (number: number) => ({
  url: `https://maps.google.com/mapfiles/kml/paddle/${
    number > 10 ? number - 10 : number
  }.png`,
  // scaledSize: new window.google.maps.Size(40, 40),
  // labelOrigin: new window.google.maps.Point(20, 13),
});

export const getRouteObjects = async (
  origin: Coord,
  destinations: Coord[],
  travelMode: TravelModeType
): Promise<google.maps.DirectionsResult[]> => {
  const directionsService = new window.google.maps.DirectionsService();
  const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
  const destinationsLatLng = destinations.map(
    (dest) => new window.google.maps.LatLng(dest.lat, dest.lng)
  );
  const distances = (await Promise.allSettled(
    destinationsLatLng.map(
      (dest) =>
        new Promise<google.maps.DirectionsResult>((resolve, reject) => {
          const request = {
            origin: originLatLng,
            destination: dest,
            drivingOptions: {
              departureTime: new Date(
                `${DISTANCE_TRAVEL_DAY} ${DISTANCE_TRAVEL_TIME}`
              ),
            },
            travelMode:
              travelMode === "Driving"
                ? window.google.maps.TravelMode.DRIVING
                : travelMode === "Transit"
                ? window.google.maps.TravelMode.TRANSIT
                : travelMode === "Bicycling"
                ? window.google.maps.TravelMode.BICYCLING
                : window.google.maps.TravelMode.WALKING,
          };
          directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(response);
            } else {
              reject(status);
            }
          });
        })
    )
  )) as any[];
  return distances.map(
    (dist) => (dist.status = "fulfilled" ? dist.value : null)
  );
};
