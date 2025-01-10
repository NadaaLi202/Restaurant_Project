import { Document } from "mongoose";
import { IUsers } from "../users/users.interface";
import { IProducts } from "../products/products.interface";

export interface ICarts extends Document {
  items: CartItems[];
  taxPrice: number;
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  user: IUsers;
}

export interface CartItems {
  _id: any;
  product: IProducts;
  quantity: number;
  price: number;
  priceAfterDiscount: number;
}
