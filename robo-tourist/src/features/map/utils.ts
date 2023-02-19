import { Coord } from "./interfaces";
import { GOOGLE_MAPS_API_KEY } from "./const";

export const getPlace = (address: string, geocoder: any) => {
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
          const photoReference = (place.photos[0] as any).photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
          resolve(photoUrl);
        } else {
          reject(new Error("No photo found for this place."));
        }
      }
    );
  });
}

// async function getPhotoReference(placeId) {
//   try {
//     const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`;
//     const placesResponse = await fetch(placesUrl);
//     const placesData = await placesResponse.json();

//     if (placesData.status !== "OK") {
//       console.error("Error searching for nearby places:", placesData.status);
//       return null;
//     }

//     // Get the photoreference of the first photo result
//     const photoReference = placesData.result.photos[0].photo_reference;
//     console.log(
//       `Photoreference for ${placesData.result.name}: ${photoReference}`
//     );
//     return photoReference;
//   } catch (error) {
//     console.error("Error getting photo reference:", error);
//     return null;
//   }
// }

// export async function getGoogleMapsPhotoUrl(placeId, photoWidth = 400) {
//   const apiUrl = "https://maps.googleapis.com/maps/api/place/photo";

//   const photoReference = await getPhotoReference(placeId);
//   if (!photoReference) return null;
//   const response = await fetch(
//     `${apiUrl}?key=${GOOGLE_MAPS_API_KEY}&photoreference=${photoReference}&maxwidth=${photoWidth}`
//   );
//   const data = await response.blob();
//   return URL.createObjectURL(data);
// }
