import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../models/product";
import agent from "../../api/agent";
import { RootState } from "../../store/counterStore";
import { MetaData } from "../../models/pagination";

const productEntityAdapter = createEntityAdapter<Product>();

interface catalogState {
  status: string;
  productsLoaded: boolean;
  filtersLoaded: boolean;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}

const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm.toString());
  if (productParams.brands.length)
    params.append("brand", productParams.brands.toString());
  if (productParams.types.length)
    params.append("type", productParams.types.toString());
  return params;
};

export const fetchProductsasync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProducts", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().catalog.productParams);

  try {
    const response = await agent.Catalog.list(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (err: any) {
    thunkAPI.rejectWithValue({ error: err.data });
  }
});

export const fetchProductasync = createAsyncThunk<Product, number>(
  "catalog/fetchProduct",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (err: any) {
      thunkAPI.rejectWithValue({ error: err.data });
    }
  }
);

export const fetchFiltersAsync = createAsyncThunk(
  "catalog/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.getFilters();
    } catch (err: any) {
      thunkAPI.rejectWithValue({ error: err.data });
    }
  }
);

const initialParams = () => {
  return {
    orderBy: "name",
    pageNumber: 1,
    pageSize: 6,
    brands: [],
    types: [],
  };
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productEntityAdapter.getInitialState<catalogState>({
    status: "idle",
    productsLoaded: false,
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initialParams(),
    metaData: null,
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload,pageNumber:1 };
    },
    setPageNumber: (state,action)=>{
      state.productsLoaded = false;
      state.productParams= { ...state.productParams, ...action.payload }
    },
    resetProductParams: (state) => {
      state.productParams = initialParams();
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsasync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsasync.fulfilled, (state, action) => {
      productEntityAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsasync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(fetchProductasync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductasync.fulfilled, (state, action) => {
      productEntityAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductasync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFiltersAsync.fulfilled, (state, action: any) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.filtersLoaded = true;
      state.status = "idle";
    });
    builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const productSelectors = productEntityAdapter.getSelectors(
  (state: RootState) => state.catalog
);

export const { setProductParams, resetProductParams, setMetaData,setPageNumber } =
  catalogSlice.actions;
