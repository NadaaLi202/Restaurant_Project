import { CartItems } from "../cart/cart.interface";
import { Document } from "mongoose";
import { IUsers, Address } from "../users/users.interface";
export interface IOrder extends Document {
  items: CartItems;
  taxPrice: number;
  itemsPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  payment: "cash" | "card";
  user: IUsers;
  address: Address;
}
