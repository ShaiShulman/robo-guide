import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import promptReducer from "./promptSlice";
import markersReducer from "./markerSlice";
import viewReducer from "./viewSlice";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
    markers: markersReducer,
    view: viewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
