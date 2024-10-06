import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaValidation } from "./checkoutValidation";
import agent from "../../api/agent";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/counterStore";
import { clearBasket } from "../basket/BasketSlice";
import { StripeElementType } from "@stripe/stripe-js";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const steps = ["Shipping address", "Review your order", "Payment details"];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderId, setOrderId] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const currentValidationSchema = schemaValidation[activeStep];
  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string };
  }>({ elementError: {} });
  const [cardComplete, setCardComplete] = useState<any>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const { basket } = useAppSelector((state) => state.basket);
  const stripe = useStripe();
  const elements = useElements();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });
  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          ...methods.getValues(),
          ...response,
          saveAddress: false,
        });
      }
    });
  }, [methods]);

  const submitOrder = async (data: FieldValues) => {
    setLoading(true);
    const { saveAddress, nameOnCard, ...address } = data;
    if (!stripe || !elements || !basket) return;
    try {
      const cardElement = elements.getElement(CardNumberElement);
      console.log(basket)
      const paymentResult = await stripe.confirmCardPayment(
        basket.clientSecret!,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: nameOnCard,
            },
          },
        }
      );
      console.log(paymentResult);
      if (paymentResult.paymentIntent?.status === "succeeded") {
        const orderId = await agent.Order.create({
          saveAddress,
          address,
        });
        setOrderId(orderId);
        setPaymentMessage("Thank you - we have received your payment");
        setPaymentSucceeded(true);
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
        setLoading(false);
      } else {
        setPaymentSucceeded(false);
        setPaymentMessage(paymentResult.error?.message ?? "Error");
        setLoading(false);
        setActiveStep(activeStep + 1);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleNext = async (data: FieldValues) => {
    if (activeStep == steps.length - 1) {
      await submitOrder(data);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return (
          <PaymentForm
            cardState={cardState}
            onCardInputChange={onCardInputChange}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const onCardInputChange = (event: any) => {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message,
      },
    });

    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const submitDisabled = () => {
    if (activeStep === steps.length - 1) {
      return (
        !cardComplete.cardNumber ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardCvc ||
        !methods.formState.isValid
      );
    } else {
      return !methods.formState.isValid;
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                {paymentMessage}
              </Typography>
              {paymentSucceeded ? (
                <Typography variant="subtitle1">
                  Your order number is #{orderId}. We have not emailed your
                  order confirmation, and will not send you an update when your
                  order has shipped as this store is a demo!
                </Typography>
              ) : (
                <Button variant="contained" onClick={handleBack}>
                  Go back and try again
                </Button>
              )}
            </>
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
