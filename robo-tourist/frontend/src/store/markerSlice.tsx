import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getImagesFromBackend } from "../features/list/google-photos";
import { getPhoto } from "../features/map/map-utils";
import { MarkerInfo } from "../globals/interfaces";
import { AppThunk, RootState } from "./store";

interface MarkerInfoProps {
  items: MarkerInfo[];
}

const initialState: MarkerInfoProps = { items: [] };

export const MarkersSlice = createSlice({
  name: "markers",
  initialState,
  reducers: {
    reset: (state) => initialState,
    update: (state, action: PayloadAction<MarkerInfo[]>) => ({
      ...state,
      items: action.payload,
    }),
    updatePhotos: (state, action: PayloadAction<string[]>) => ({
      ...state,
      items: state.items.map((item, idx) => ({
        ...item,
        imageUrl: action.payload[idx],
      })),
    }),
    updatePhotosPartial: (
      state,
      action: PayloadAction<{ indexes: number[]; photos: string[] }>
    ) => {
      const newState = {
        ...state,
        items: state.items.map((item, idx) => ({
          ...item,
          imageUrl: action.payload.indexes.includes(idx)
            ? action.payload.photos[
                action.payload.indexes.findIndex((i) => i === idx)
              ]
            : item.imageUrl,
        })),
      };
      return newState;
    },
  },
});

export const updateMarkerPhotos = (Map: any): AppThunk => {
  return async (dispatch, getState) => {
    const gmapPhotos: string[] = await getPhotosFromGoogleMaps(
      getState().markers.items.map((item) => item.placeId),
      Map
    );
    dispatch(markersActions.updatePhotos(gmapPhotos));
    const emptyImagesIdx: number[] = gmapPhotos.reduce((acc, curr, idx) => {
      if (!curr || curr.length === 0) acc.push(idx);
      return acc;
    }, []);

    const missingPhotosIdx = Array.from(
      new Set(emptyImagesIdx.concat(findNonUniqueIndexes(gmapPhotos)))
    );
    const missingPhotosNames = getState()
      .markers.items.map((marker) => marker.title)
      .map((item, index) => {
        return missingPhotosIdx.includes(index) ? item : null;
      })
      .filter((item) => item !== null);

    const searchPhotos = await getPhotosFromSearch(
      missingPhotosNames,
      getState().prompt.target,
      getState().prompt.preference
    );

    if (searchPhotos) {
      dispatch(
        markersActions.updatePhotosPartial({
          indexes: missingPhotosIdx,
          photos: searchPhotos,
        })
      );
    }
  };
};

const getPhotosFromGoogleMaps = async (placeIds: string[], Map: any) => {
  const urls = (await Promise.allSettled(
    placeIds.map((id) => getPhoto(id, Map))
  )) as any[];
  return urls.map((url) => url.value);
};

const getPhotosFromSearch = async (
  places: string[],
  target: string,
  preference?: string
) => {
  return (await getImagesFromBackend(places, target, preference)).map(
    (item) => item.image
  );
};

const findNonUniqueIndexes = (list: any[]) => {
  const nonUniqueIndexes: number[] = [];

  for (let i = 0; i < list.length; i++) {
    const value = list[i];

    if (
      list
        .slice(0, i)
        .concat(list.slice(i + 1))
        .includes(value)
    ) {
      nonUniqueIndexes.push(i);
    }
  }

  return nonUniqueIndexes;
};

export const selectMarkers = createSelector(
  (state: RootState) => state.markers,
  (data) => data.items
);

export const selectImages = createSelector(
  (state: RootState) => state.markers,
  (data) => data.items.map((item) => item.imageUrl)
);

export const markersActions = MarkersSlice.actions;

export default MarkersSlice.reducer;
