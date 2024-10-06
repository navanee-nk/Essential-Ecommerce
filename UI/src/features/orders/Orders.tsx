import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import LoadingComponent from "../../layout/LoadingComponent";
import { Order as orderType } from "../../models/order";
import { currencyFormatter } from "../../util/util";
import OrderDetailed from "./OrderDetailed";

const Orders = () => {
  const [orders, setOrders] = useState<orderType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(0);

  useEffect(() => {
    agent.Order.list()
      .then((data) => setOrders(data))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading Orders ..." />;

  if (selectedOrder > 0) {
    const order = orders?.find((o) => o.id === selectedOrder);
    return <OrderDetailed order={order!} setSelectedOrder={setSelectedOrder} />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">
                {currencyFormatter(order.total)}
              </TableCell>
              <TableCell align="right">
                {order.orderDate.split("T")[0]}
              </TableCell>
              <TableCell align="right">{order.status}</TableCell>
              <TableCell align="right">
                <Button onClick={() => setSelectedOrder(order.id)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Orders;
