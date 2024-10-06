export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type?: string;
  brand: string;
  pictureUrl: string;
  quantityInStock?: number;
}

export interface ProductParams {
  orderBy: string;
  searchTerm?: string;
  brands: string[];
  types: string[];
  pageNumber: number;
  pageSize: number;
}
