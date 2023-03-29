import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ViewSliceProps {
  selected: number | null;
  directions: boolean;
  compact: boolean;
}

const initialState: ViewSliceProps = {
  selected: null,
  directions: true,
  compact: true,
};

export const ViewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number | null>) => {
      return { ...state, selected: action.payload };
    },
    setDirections: (state, action: PayloadAction<boolean>) => {
      return { ...state, directions: action.payload };
    },
    toggleCompact: (state) => ({
      ...state,
      compact: !state.compact,
    }),
    toggleDirections: (state) => ({ ...state, directions: !state.directions }),
    reset: (state) => {
      return initialState;
    },
  },
});

export const selectView = createSelector(
  (state: RootState) => state.view,
  (data) => data
);

export const viewActions = ViewSlice.actions;

export default ViewSlice.reducer;
