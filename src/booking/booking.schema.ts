import { Schema, model } from "mongoose";
import { IBooking } from "./booking.interface";

export const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to the user
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    occasion: { type: String, required: true },
    message: { type: String, required: false }, // Optional field
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  } // Adds `createdAt` and `updatedAt` fields
);
bookingSchema.pre<IBooking>("save", function (next) {
  this.populate({ path: "user", select: "_id name" });
  next();
});

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
