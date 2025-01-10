import mongoose, { Schema } from "mongoose";
import { Booking } from "./booking.interface";

const bookingSchema = new Schema<Booking>({
  id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
