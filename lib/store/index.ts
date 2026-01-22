import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import advertSlice from "./slices/advertSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    advert: advertSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
