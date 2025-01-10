import { IProducts } from "products/products.interface";
import { IUsers } from "users/users.interface";

export interface IReviews extends Document {
  populate(arg0: { path: string; select: string }): unknown;
  readonly user: IUsers;
  readonly product: IProducts;
  readonly rate: number;
  readonly comment: string;
  readonly createdAt: Date;
}
