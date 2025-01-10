import mongoose from "mongoose";
import { IReviews } from "./reviews.interface";
import productsSchema from "../products/product.schema";

const reviewsSchema = new mongoose.Schema<IReviews>(
  {
    comment: String,
    rate: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  },
  { timestamps: true }
);

reviewsSchema.statics.calcRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rate" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await productsSchema.findByIdAndUpdate(productId, {
      rateAvg: result[0].avgRating,
      rating: result[0].ratingQuantity,
    });
  } else {
    await productsSchema.findByIdAndUpdate(productId, {
      rateAvg: 0,
      rate: 0,
    });
  }
};
reviewsSchema.post<IReviews>("save", async function () {
  await (this.constructor as any).calcRating(this.product);
});
reviewsSchema.post<IReviews>(
  "findOneAndUpdate",
  async function (doc: IReviews) {
    await (doc.constructor as any).calcRating(doc.product);
  }
);
reviewsSchema.post<IReviews>(
  "findOneAndDelete",
  async function (doc: IReviews) {
    await (doc.constructor as any).calcRating(doc.product);
  }
);

reviewsSchema.pre<IReviews>(/^find/, function (next) {
  this.populate({ path: "user", select: "name image" });
  next();
});

export default mongoose.model<IReviews>("reviews", reviewsSchema);
