import express from "express";
import bookingService from "./booking.service";
import authService from "../auth/auth.services";

const router = express.Router();

// Get all bookings for a user
router.get(
  "/:userId/bookings",
  authService.protectedRoutes,
  bookingService.getBooking
);

// Create a booking for a user
router.post(
  "/:userId/bookings",
  authService.protectedRoutes,
  bookingService.makeBooking
);

// Update a booking for a user
router.patch(
  "/:userId/bookings/:bookingId",
  authService.protectedRoutes,
  bookingService.updateBooking
);

// Cancel a booking for a user
router.delete(
  "/:userId/bookings/:bookingId",
  authService.protectedRoutes,
  bookingService.cancelBooking
);

export default router;
