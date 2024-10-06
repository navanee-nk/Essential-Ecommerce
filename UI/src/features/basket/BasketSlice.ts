import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../models/basket";
import agent from "../../api/agent";
import { getCookie } from "../../util/util";

interface BasketStateType {
  basket: Basket | null;
  status: string;
}

const initialState: BasketStateType = {
  basket: null,
  status: "idle",
};

export const getBasketAsync = createAsyncThunk<Basket>(
  "basket/getBasketAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Basket.getBasket();
    } catch (err: any) {
      return thunkAPI.rejectWithValue({ error: err.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) return false;
    },
  }
);

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (err: any) {
      return thunkAPI.rejectWithValue({ error: err.data });
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>("basket/removeItemAsync", async ({ productId, quantity }, thunkAPI) => {
  try {
    return await agent.Basket.removeItem(productId, quantity);
  } catch (err: any) {
    return thunkAPI.rejectWithValue({ error: err.data });
  }
});

export const BasketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    clearBasket: (state) => {
      state.basket = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      console.log(action);
      state.status = "pendingAddItem" + action.meta.arg.productId;
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket = action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.basket?.basketItems.findIndex(
        (item) => item.productId == productId
      );
      
      if (itemIndex ==undefined || itemIndex === -1)
        {          
          state.status = "idle";
          return;
        } 
      state.basket!.basketItems[itemIndex].quantity -= quantity;
      
      if (state.basket?.basketItems[itemIndex].quantity === 0)
        state.basket.basketItems.splice(itemIndex, 1);
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addMatcher(
      isAnyOf(addBasketItemAsync.fulfilled, getBasketAsync.fulfilled),
      (state, action) => {
        state.basket = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(addBasketItemAsync.rejected, getBasketAsync.rejected),
      (state, action) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const { setBasket, clearBasket } = BasketSlice.actions;
