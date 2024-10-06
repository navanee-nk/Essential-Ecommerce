import { Typography } from "@mui/material";
import BasketTable from "../basket/BasketTable";
import { useAppSelector } from "../../store/counterStore";

export default function Review() {
  const { basket } = useAppSelector((state) => state.basket);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && <BasketTable items={basket.basketItems} isBasket={false} />}
    </>
  );
}
