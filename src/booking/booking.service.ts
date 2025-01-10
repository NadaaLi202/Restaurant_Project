import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import usersSchema from "../users/users.schema";
import { IUsers } from "../users/users.interface";
import ApiErrors from "../utils/apiErrors";

class BookingService {
  getBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findById(req.user._id);
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ length: user.booking.length, data: user.booking });
    }
  );
  makeBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { address: req.body.address } },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ length: user.booking.length, data: user.booking });
    }
  );
  updateBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        { $set: { "address.$[elem]": req.body.address } },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ length: user.booking.length, data: user.booking });
    }
  );
  cancelBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        { $pull: { booking: { _id: req.params.bookingId } } },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ length: user.booking.length, data: user.booking });
    }
  );
}

const bookingService = new BookingService();
export default bookingService;
