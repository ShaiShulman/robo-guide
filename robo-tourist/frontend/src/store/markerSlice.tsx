import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarkerInfo } from "../globals/interfaces";
import { RootState } from "./store";

interface MarkerInfoProps {
  items: MarkerInfo[];
}

const initialState: MarkerInfoProps = { items: [] };

export const MarkersSlice = createSlice({
  name: "markers",
  initialState,
  reducers: {
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
