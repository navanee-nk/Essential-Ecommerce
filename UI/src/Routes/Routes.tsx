import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Catalog from "../features/catalog/Catalog";
import ProductDetail from "../features/catalog/ProductDetail";
import ContactPage from "../features/contact/ContactPage";
import AboutPage from "../features/about/AboutPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../features/basket/BasketPage";
import Login from "../features/account/Login";
import Register from "../features/account/Register";
import RequireAuth from "./RequireAuth";
import Order from "../features/orders/Orders";
import CheckoutWrapper from "../features/checkout/CheckoutWrapper";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "checkout",
            element: <CheckoutWrapper />,
          },
          {
            path: "orders",
            element: <Order />,
          },
        ],
      },

      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/:id",
        element: <ProductDetail />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "server-error",
        element: <ServerError />,
      },
      {
        path: "basket",
        element: <BasketPage />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "not-found",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate replace to="not-found" />,
      },
    ],
  },
]);

export default Router;
