export interface Basket {
  id: number;
  buyerId: string;
  basketItems: BasketItem[];
  paymentIntentId?: string;
  clientSecret?: string;
}

export interface BasketItem {
  productId: number;
  productName: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantity: number;
}
