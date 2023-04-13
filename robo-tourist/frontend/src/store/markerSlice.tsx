import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarkerInfo } from "../data/interfaces";
import { RootState } from "./store";

interface MarkerInfoProps {
  items: MarkerInfo[];
  isLoaded: boolean;
}

const initialState: MarkerInfoProps = { items: [], isLoaded: false };

export const MarkersSlice = createSlice({
  name: "markers",
  initialState,
  reducers: {
    reset: (state) => initialState,
    update: (state, action: PayloadAction<MarkerInfo[]>) => ({
      ...state,
      items: action.payload,
    }),
    updateDetails: (state, action: PayloadAction<Partial<MarkerInfo>[]>) => ({
      ...state,
      items: state.items.map((item, idx) => ({
        ...item,
        ...action.payload[idx],
      })),
    }),

    updatePhotos: (state, action: PayloadAction<string[]>) => ({
      ...state,
      items: state.items.map((item, idx) => ({
        ...item,
        photo: action.payload[idx],
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
          photo: action.payload.indexes.includes(idx)
            ? action.payload.photos[
                action.payload.indexes.findIndex((i) => i === idx)
              ]
            : item.photo,
        })),
      };
      return newState;
    },
    setLoaded: (state) => ({ ...state, isLoaded: true }),
  },
});

export const selectMarkers = createSelector(
  (state: RootState) => state.markers,
  (data) => data.items
);

export const selectPhotos = createSelector(
  (state: RootState) => state.markers,
  (data) => data.items.map((item) => item.photo)
);

export const selectIsMarkersLoaded = createSelector(
  (state: RootState) => state.markers,
  (data) => data.isLoaded
);

export const markersActions = MarkersSlice.actions;

export default MarkersSlice.reducer;
