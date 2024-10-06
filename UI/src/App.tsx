import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Header from "./layout/Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { getCookie } from "./util/util";
import LoadingComponent from "./layout/LoadingComponent";
import { useAppDispatch } from "./store/counterStore";
import { getBasketAsync } from "./features/basket/BasketSlice";
import { fetchCurrentUser } from "./features/account/accountSlice";
import HomePage from "./features/Home/HomePage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [dark, setIsDark] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const initApp = useCallback(async () => {
    try {
      const buyerId = getCookie("buyerId");
      await dispatch(fetchCurrentUser());
      if (buyerId) await dispatch(getBasketAsync());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);
  useEffect(() => {
    initApp().then(() => {
      setLoading(false);
    });
  }, [initApp]);

  const palatte = dark ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: palatte,
    },
  });

  if (loading) return <LoadingComponent message="Initializing App..." />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        palatte={palatte}
        onSetMode={() => setIsDark((prevState) => !prevState)}
      />
      {loading ? (
        <LoadingComponent message="Initialising App..." />
      ) : location.pathname === "/" ? (
        <HomePage />
      ) : (
        <Container sx={{ mt: 4 }}>
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  );
};

export default App;
