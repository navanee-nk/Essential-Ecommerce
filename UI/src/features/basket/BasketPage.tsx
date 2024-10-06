import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/counterStore";
import BasketTable from "./BasketTable";

const BasketPage = () => {
  const { basket } = useAppSelector((state) => state.basket);
  

  if (!basket) return <Typography variant="h2">No Basket Found</Typography>;
  return (
    <>
      <BasketTable isBasket={true} items={basket.basketItems} />
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            fullWidth
            variant="contained"
            size="large"
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default BasketPage;
