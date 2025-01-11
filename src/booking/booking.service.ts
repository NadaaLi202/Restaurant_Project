import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";
import bookingSchema from "./booking.schema";
import { IBooking } from "./booking.interface";
import refactorService from "../refactor.service";

class BookingService {
  // Get all bookings for a specific user
  getBooking = refactorService.getAll<IBooking>(bookingSchema, "booking");

  // Create a new booking for a specific user
  makeBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, phone, date, time, guests, occasion, message } =
        req.body;

      // Extract the user ID from the authenticated user
      const userId = req.user._id;

      const newBooking = await bookingSchema.create({
        user: userId, // Use the authenticated user's ID
        name,
        email,
        phone,
        date,
        time,
        guests,
        occasion,
        message,
      });

      if (!newBooking) {
        return next(new ApiErrors(req.__("booking_failed"), 400));
      }

      // Optionally, update the user's booking list
      const user = await usersSchema.findByIdAndUpdate(
        userId,
        { $addToSet: { bookings: newBooking._id } },
        { new: true }
      );

      if (!user) {
        return next(new ApiErrors(req.__("user_not_found"), 404));
      }

      res.status(201).json({
        status: "success",
        data: newBooking,
      });
    }
  );
  // Update a booking for a specific user
  updateBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId, bookingId } = req.params;

      // Ensure the booking belongs to the specified user
      const booking = await bookingSchema.findOne({
        _id: bookingId,
        user: userId,
      });

      if (!booking) {
        return next(new ApiErrors(req.__("booking_not_found"), 404));
      }

      const updatedBooking = await bookingSchema.findByIdAndUpdate(
        bookingId,
        { ...req.body }, // Update booking details from the request body
        { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      res.status(200).json({
        status: "success",
        data: updatedBooking,
      });
    }
  );

  // Cancel a booking for a specific user
  cancelBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId, bookingId } = req.params;

      // Ensure the booking belongs to the specified user
      const booking = await bookingSchema.findOne({
        _id: bookingId,
        user: userId,
      });

      if (!booking) {
        return next(new ApiErrors(req.__("booking_not_found"), 404));
      }

      // Remove the booking from the bookings collection
      const deletedBooking = await bookingSchema.findByIdAndDelete(bookingId);

      // Remove the booking reference from the user's bookings array
      const user = await usersSchema.findByIdAndUpdate(
        userId,
        { $pull: { bookings: bookingId } },
        { new: true }
      );

      if (!user) {
        return next(new ApiErrors(req.__("user_not_found"), 404));
      }

      res.status(200).json({
        status: "success",
        data: null, // Indicate that the booking was canceled
      });
    }
  );
}

const bookingService = new BookingService();
export default bookingService;
