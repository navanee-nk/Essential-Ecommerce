import { configureStore } from "@reduxjs/toolkit";
import { CounterSlice } from "../features/contact/CounterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { BasketSlice } from "../features/basket/BasketSlice";
import { catalogSlice } from "../features/catalog/catalogSlice";
import { accoutSlice } from "../features/account/accountSlice";

export const store = configureStore({
  reducer: {
    counter: CounterSlice.reducer,
    basket: BasketSlice.reducer,
    catalog: catalogSlice.reducer,
    account: accoutSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
