import { Router } from "express";
import bookingService from "./booking.service";
import authService from "../auth/auth.services";

const bookingRouter: Router = Router();

bookingRouter.get("/", authService.protectedRoutes, bookingService.getBooking);
bookingRouter.post(
  "/",
  authService.protectedRoutes,
  bookingService.makeBooking
);
bookingRouter.put(
  "/:bookingId",
  authService.protectedRoutes,
  bookingService.updateBooking
);
bookingRouter.delete(
  "/:bookingId",
  authService.protectedRoutes,
  bookingService.cancelBooking
);

export default bookingRouter;
