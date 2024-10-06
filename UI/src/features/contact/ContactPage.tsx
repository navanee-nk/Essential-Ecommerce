import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { decrement, increment } from "./CounterSlice";
import { useAppSelector } from "../../store/counterStore";

const ContactPage = () => {
  const { title, data } = useAppSelector((state) => state.counter);

  const dispatch = useDispatch();
  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h2">The data is :{data}</Typography>
      <ButtonGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(increment(1))}
        >
          Increment
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch(decrement(1))}
        >
          Decrement
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => dispatch(increment(5))}
        >
          Increment By 5
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ContactPage;
