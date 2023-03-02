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

export const getPlaceName = (place: string) => {
  const splitChars = /–|:/;
  return place.split(splitChars, 2)[0];
}