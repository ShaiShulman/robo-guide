import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TravelMode } from "../globals/interfaces";
import { RootState } from "./store";

interface PromptSliceProps {
  target: string;
  preference: string;
  origin: string;
  travelMode: TravelMode;
}

const initialState: PromptSliceProps = {
  target: "",
  preference: "",
  origin: "",
  travelMode: "Walking",
};

export const PromptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<PromptSliceProps>) => {
      return action.payload;
    },
    updateTravelMode: (state, action: PayloadAction<TravelMode>) => {
      return { ...state, travelMode: action.payload };
    },
  },
});

export const selectPrompt = createSelector(
  (state: RootState) => state.prompt,
  (data) => data
);

export const promptActions = PromptSlice.actions;

export default PromptSlice.reducer;
