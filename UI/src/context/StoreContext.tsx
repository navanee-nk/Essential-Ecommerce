import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (context == null) throw new Error("Problem loading context details");
  return context;
};

export const StoreContextProvider = ({ children }: PropsWithChildren) => {
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (basket == null) return;
    const basketItems = [...basket.basketItems];
    const itemIndex = basketItems.findIndex((item) => item.productId === productId);
    if (itemIndex >= 0) {
      basketItems[itemIndex].quantity -= quantity;
      if (basketItems[itemIndex].quantity <= 0) {
        basketItems.splice(itemIndex, 1);
      }
      setBasket((prevState) => {
        console.log({ ...prevState, basketItems });
        return { ...prevState!, basketItems };
      });
    }
  };
  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
};
