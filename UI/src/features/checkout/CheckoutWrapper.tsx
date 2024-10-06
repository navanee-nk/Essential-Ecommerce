import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/counterStore";
import agent from "../../api/agent";
import { setBasket } from "../basket/BasketSlice";
import LoadingComponent from "../../layout/LoadingComponent";
const stripePromise = loadStripe(
  "pk_test_51Q6S5iFKK3IE5NBzK5QpZMecuqug6PTBvR7uZi9lOuwdeK9kHdoc8YLBlDsmBiJHnGCbPjuj8wgRF5MME2Ul1S070000ZtJ13u"
);

const CheckoutWrapper = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    agent.Payment.createPaymentIntent()
      .then((basket) => {
        dispatch(setBasket(basket));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if(loading) return <LoadingComponent message="Loading checkout..." />

  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;
