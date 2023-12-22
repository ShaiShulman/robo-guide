import { getImagesFromBackend } from "../../api-services/images";
import { PlaceDetailsResponse } from "./interfaces";
import { getPlaceDetailsPhoto } from "./map-utils";

export const getPlaceDetailsFromGoogleMaps = async (
  placeIds: string[],
  Map: any
) => {
  const details = (await Promise.allSettled(
    placeIds.map((id) => getPlaceDetailsPhoto(id, Map))
  )) as PromiseFulfilledResult<PlaceDetailsResponse>[];
  return details.map((response) => response.value);
};

export const getPhotosFromSearch = async (
  places: string[],
  target: string,
  preference?: string
) => {
  return (await getImagesFromBackend(places, target, preference)).map(
    (item) => item.image
  );
};
