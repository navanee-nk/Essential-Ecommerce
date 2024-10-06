import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { currencyFormatter } from "../../util/util";
import { useAppSelector } from "../../store/counterStore";

interface Props {
  subtotal?: number;
}

export default function BasketSummary({ subtotal }: Props) {
  const { basket } = useAppSelector((state) => state.basket);
  if (subtotal == undefined) {
    subtotal = basket
      ? basket.basketItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      : 0;
  }

  const deliveryFee = subtotal > 10000 ? 0 : 500;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{currencyFormatter(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">
                {currencyFormatter(deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                {currencyFormatter(subtotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
