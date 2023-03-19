import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import promptReducer from "./promptSlice";
import markersReducer from "./markerSlice";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
    markers: markersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
