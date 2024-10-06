import { Box, Button, Grid, Typography } from "@mui/material";
import { Order } from "../../models/order";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";
import { BasketItem } from "../../models/basket";

interface Props {
  order: Order;
  setSelectedOrder: (id: number) => void;
}

const OrderDetailed = ({ order, setSelectedOrder }: Props) => {
  const subTotal =
    order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
          Order# {order.id} - {order.status}
        </Typography>
        <Button
          onClick={() => setSelectedOrder(0)}
          size="large"
          variant="contained"
          sx={{ m: 2 }}
        >
          Back To Orders
        </Button>
      </Box>
      <BasketTable
        isBasket={false}
        items={order.orderItems as unknown as BasketItem[]}
      />
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <BasketSummary subtotal={subTotal} />
        </Grid>
      </Grid>
    </>
  );
};

export default OrderDetailed;
