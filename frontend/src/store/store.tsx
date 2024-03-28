import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import promptReducer from "./promptSlice";
import markersReducer from "./markerSlice";
import viewReducer from "./viewSlice";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
    markers: markersReducer,
    view: viewReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
