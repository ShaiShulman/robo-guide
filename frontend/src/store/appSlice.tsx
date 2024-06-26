import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMode } from "../data/interfaces";
import { AppThunk, RootState } from "./store";
import { markersActions } from "./markerSlice";
import { viewActions } from "./viewSlice";

export interface AppSliceProps {
  mode: AppMode;
  error: string | null;
}

const initialState: AppSliceProps = {
  mode: "Prompt",
  error: null,
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => ({
      ...state,
      mode: "Error",
      error: action.payload,
    }),
    setMode: (state, action: PayloadAction<AppMode>) => ({
      ...state,
      mode: action.payload,
      error: null,
    }),
  },
});

export const resetAppState = (): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(viewActions.reset());
    dispatch(markersActions.reset());
    dispatch(appActions.setMode("Prompt"));
  };
};

export const selectAppState = createSelector(
  (state: RootState) => state.app,
  (data) => data
);

export const appActions = AppSlice.actions;

export default AppSlice.reducer;
