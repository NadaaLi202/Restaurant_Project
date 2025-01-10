import mongoose from "mongoose";
import { ICarts } from "./cart.interface";

const cartSchema = new mongoose.Schema<ICarts>({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: Number,
      priceAfterDiscount: Number,
    },
  ],
  taxPrice: Number,
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

cartSchema.pre("save", async function (next) {
  this.populate({
    path: "items.product",
    select: "name image cover",
  });
});

export default mongoose.model<ICarts>("Cart", cartSchema);
