import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getImagesFromBackend } from "../features/list/google-photos";
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
    update: (state, action: PayloadAction<MarkerInfo[]>) => {
      return { ...state, items: action.payload };
    },
    updatePhotos: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        items: state.items.map((item, idx) => ({
          ...item,
          imageUrl: action.payload[idx],
        })),
      };
    },
  },
});

export const updateMarkerPhotos = (): AppThunk => {
  return async (dispatch, getState) => {
    const places = getState().markers.items.map((marker) => marker.title);
    const target = getState().prompt.target;
    const preference = getState().prompt.preference;
    const images = (await getImagesFromBackend(places, target, preference)).map(
      (item) => item.image
    );
    console.log(images);
    dispatch(markersActions.updatePhotos(images));
  };
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
