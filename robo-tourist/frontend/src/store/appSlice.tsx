import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMode } from "../globals/interfaces";
import { RootState } from "./store";

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

export const selectAppState = createSelector(
  (state: RootState) => state.app,
  (data) => data
);

export const appActions = AppSlice.actions;

export default AppSlice.reducer;
