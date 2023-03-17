export const getPlacePhotoUrl: (
  placeName: string,
  MapsApi: any
) => Promise<string> = async (placeName: string, MapsApi: any) => {
  return new Promise((resolve, reject) => {
    const geocoder = new MapsApi.Geocoder();
    const service = new MapsApi.places.PlacesService();

    geocoder.geocode({ address: placeName }, async (results, status) => {
      if (status === MapsApi.GeocoderStatus.OK) {
        const placeId = results[0].place_id;
        console.log(placeId);
        const request = {
          placeId,
          fields: ["photos"],
        };
        try {
          const place: any = await new Promise((resolve, reject) => {
            service.getDetails(request, (place, status) => {
              if (status === MapsApi.places.PlacesServiceStatus.OK) {
                resolve(place);
              } else {
                reject(new Error(`Failed to get place details: ${status}`));
              }
            });
          });
          const photoUrl = place.photos[0].getUrl();
          console.log(photoUrl);
          resolve(photoUrl);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Failed to geocode place name: ${status}`));
      }
    });
  });
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`;
};

export const formatDistace = (meters: number) => {
  if (meters < 500) return `${meters} m`;
  else return `${(meters / 1000).toFixed(1)} km`;
};
