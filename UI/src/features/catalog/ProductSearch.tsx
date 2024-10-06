import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/counterStore";
import { useState } from "react";
import { setProductParams } from "./catalogSlice";

const ProductSearch = () => {
  const dispatch = useAppDispatch();
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((event: any) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  },1000);

  return (
    <TextField
      label="Search Products"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    ></TextField>
  );
};

export default ProductSearch;
