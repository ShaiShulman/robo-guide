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
    create: (state, action: PayloadAction<MarkerInfo[]>) => {
      return { ...state, items: action.payload };
    },
  },
});

export const selectMarkers = createSelector(
  (state: RootState) => state.markers,
  (data) => data.items
);

export const markersActions = MarkersSlice.actions;

export default MarkersSlice.reducer;
