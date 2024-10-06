import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { Product as ProductType } from "../../models/product";
import { useAppSelector } from "../../store/counterStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  products: ProductType[];
}

const Product = ({ products }: Props) => {
  const { productsLoaded } = useAppSelector((state) => state.catalog);

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={4} key={product.id}>
          {!productsLoaded ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product}></ProductCard>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Product;
