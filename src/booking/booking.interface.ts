import { Document, Types } from "mongoose";
import { IUsers } from "../users/users.interface";

export interface IBooking extends Document {
  user: Types.ObjectId | IUsers; // Reference to the user
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  occasion: string;
  message?: string; // Optional field
}
