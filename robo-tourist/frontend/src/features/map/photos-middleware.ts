import { markersActions } from "../../store/markerSlice";
import { AppThunk } from "../../store/store";
import { findNonUniqueIndexes } from "../../utils/index-utils";
import {
  getPlaceDetailsFromGoogleMaps,
  getPhotosFromSearch,
} from "./place-details-utils";

export const updateMarkerDetailsPhotos = (Map: any): AppThunk => {
  return async (dispatch, getState) => {
    const gmapPlaceDetails = await getPlaceDetailsFromGoogleMaps(
      getState().markers.items.map((item) => item.placeId),
      Map
    );

    const emptyImagesIdx: number[] = gmapPlaceDetails
      .map((item) => item?.photo)
      .reduce((acc, curr, idx) => {
        if (!curr || curr.length === 0) acc.push(idx);
        return acc;
      }, []);

    const missingPhotosIdx = Array.from(
      new Set(emptyImagesIdx.concat(findNonUniqueIndexes(gmapPlaceDetails)))
    );

    dispatch(
      markersActions.updateDetails(
        gmapPlaceDetails.map((item, idx) =>
          missingPhotosIdx.includes(idx) ? { ...item, photo: null } : item
        )
      )
    );

    for (const idx of missingPhotosIdx) {
      const photo = await getPhotosFromSearch(
        [getState().markers.items.map((marker) => marker.title)[idx]],
        getState().prompt.target,
        getState().prompt.preference
      );
      if (photo[0])
        dispatch(
          markersActions.updatePhotosPartial({ indexes: [idx], photos: photo })
        );
    }

    dispatch(markersActions.setLoaded());
  };
};
