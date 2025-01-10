import { Document, Schema } from "mongoose";

export interface IUsers extends Document {
  readonly username: string;
  readonly email: string;
  readonly name: string;
  password: string;
  readonly role: Role;
  readonly active: boolean;
  googleId: string;
  hasPassword: boolean;
  wishlist: Schema.Types.ObjectId[];
  booking: Schema.Types.ObjectId[];
  orders: Schema.Types.ObjectId[];
  passwordChangedAt: Date | number;
  passwordResetCode: string | undefined;
  passwordResetCodeExpires: Date | number | undefined;
  passwordResetCodeVerify: boolean | undefined;
  image: string;
}

type Role = "admin" | "employee" | "user";
