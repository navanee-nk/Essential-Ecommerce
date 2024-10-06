import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { currencyFormatter } from "../../util/util";
import { removeBasketItemAsync, addBasketItemAsync } from "./BasketSlice";
import { useAppDispatch, useAppSelector } from "../../store/counterStore";
import { BasketItem } from "../../models/basket";

interface Props {
  items: BasketItem[];
  isBasket?: boolean;
}

const BasketTable = ({ items, isBasket }: Props) => {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">SubTotal</TableCell>
            {isBasket && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    src={item.pictureUrl}
                    alt={item.productName}
                    style={{ height: 50 }}
                  />
                  <span>{item.productName}</span>
                </Box>
              </TableCell>
              <TableCell align="right">
                {currencyFormatter(item.price)}
              </TableCell>
              <TableCell align="center">
                {isBasket && (
                  <LoadingButton
                    loading={status.includes(
                      "pendingRemoveItem" + item.productId + "rem"
                    )}
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: "rem",
                        })
                      )
                    }
                  >
                    <Remove color="error" />
                  </LoadingButton>
                )}
                {item.quantity}
                {isBasket && (
                  <LoadingButton
                    loading={status.includes("pendingAddItem" + item.productId)}
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({ productId: item.productId })
                      )
                    }
                  >
                    <Add color="secondary" />
                  </LoadingButton>
                )}
              </TableCell>
              <TableCell align="right">
                {currencyFormatter(item.price * item.quantity)}
              </TableCell>
              <TableCell align="right">
                {isBasket && (
                  <LoadingButton
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: "del",
                        })
                      )
                    }
                    loading={status.includes(
                      "pendingRemoveItem" + item.productId + "del"
                    )}
                    color="error"
                  >
                    <Delete />
                  </LoadingButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasketTable;
