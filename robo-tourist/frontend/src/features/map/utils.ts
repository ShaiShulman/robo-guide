import { Coord, TravelMode } from "./interfaces";

export const getPlace = (address: string, geocoder: any): any => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          id: results[0].place_id,
        });
      } else {
        reject(status);
      }
    });
  });
};

export const getBounds = (markers: Coord[]) => {
  const bounds = new window.google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
  });
  return bounds;
};

export async function getPhoto(placeId, map) {
  return new Promise((resolve, reject) => {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(
      { placeId: placeId, fields: ["name", "geometry", "photos"] },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place.photos &&
          place.photos.length
        ) {
          const photoUrl = (place.photos[0] as any).getUrl();
          // const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
          resolve(photoUrl);
        } else {
          reject(new Error("No photo found for this place."));
        }
      }
    );
  });
}

export const splitPlaceName = (place: string) => {
  const splitChars = /–|:|-/;
  return place.split(splitChars, 2);
};

export const getDistances = async (
  origin: Coord,
  destinations: Coord[],
  travelMode: TravelMode
) => {
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
            travelMode:
              travelMode === "Driving"
                ? window.google.maps.TravelMode.DRIVING
                : travelMode === "Transit"
                ? window.google.maps.TravelMode.TRANSIT
                : window.google.maps.TravelMode.DRIVING,
          };
          directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(response);
              // const duration = response.routes[0].legs[0].duration.value;
              // resolve(Math.floor(duration / 60));
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
