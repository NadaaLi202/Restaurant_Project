import mongoose from "mongoose";
import { Subcategories } from "./subcategory.interface";

const subcategoriesSchema = new mongoose.Schema<Subcategories>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
  },
  { timestamps: true }
);

subcategoriesSchema.pre<Subcategories>(/^find/, function (next): void {
  this.populate({ path: "category", select: " _id name" });
  next();
});

export default mongoose.model<Subcategories>(
  "Subcategories",
  subcategoriesSchema
);
