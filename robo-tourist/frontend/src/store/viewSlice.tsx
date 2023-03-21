import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ViewSliceProps {
  selected: number | null;
  directions: boolean;
}

const initialState: ViewSliceProps = {
  selected: null,
  directions: true,
};

export const ViewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number | null>) => {
      return { ...state, selected: action.payload };
    },
    setdirections: (state, action: PayloadAction<boolean>) => {
      return { ...state, directions: action.payload };
    },
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
