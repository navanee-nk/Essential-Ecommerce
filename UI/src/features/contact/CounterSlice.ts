import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  data: number;
  title: string;
}

const initialState: CounterState = {
  data: 42,
  title: "Counter Application",
};

export const CounterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state: CounterState, action) => {
      state.data = state.data + action.payload;
    },
    decrement: (state: CounterState, action) => {
      state.data = state.data - action.payload;
    },
  },
});

export const {increment,decrement} = CounterSlice.actions;
