import { createRoot } from "react-dom/client";

import "./styles/style.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Routes/Routes.tsx";
import { StoreContextProvider } from "./context/StoreContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/counterStore.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById("root")!).render(
  <>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    <StoreContextProvider>
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
    </StoreContextProvider>
  </>
);
