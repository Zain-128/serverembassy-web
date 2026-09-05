import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import { storeApi } from "./storeApi";
import { authApi } from "./authApi";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      [storeApi.reducerPath]: storeApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(storeApi.middleware, authApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
