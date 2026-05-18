import type { Product } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
  size: Product["sizes"][number]["label"];
};

export type CheckoutCustomer = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: "Cash on delivery" | "Vodafone Cash" | "InstaPay";
};
