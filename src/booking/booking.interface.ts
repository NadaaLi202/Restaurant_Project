import { Document } from "mongoose";
import { IUsers } from "../users/users.interface";

export interface Booking {
  id: IUsers;
  customerName: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  occasion: string;
  message: string;
}
