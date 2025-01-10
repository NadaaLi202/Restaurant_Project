import { body } from "express-validator";
import validatorMiddleware from "../middleware/validator.middleware";

export class BookingValidation {
  createBooking = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("guests").notEmpty().withMessage("Guests is required"),
    body("occasion").notEmpty().withMessage("Occasion is required"),
    body("message").notEmpty().withMessage("Message is required"),

    validatorMiddleware,
  ];
  updateBooking = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("guests").notEmpty().withMessage("Guests is required"),
    body("occasion").notEmpty().withMessage("Occasion is required"),
    body("message").notEmpty().withMessage("Message is required"),

    validatorMiddleware,
  ];
  cancelBooking = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("guests").notEmpty().withMessage("Guests is required"),
    body("occasion").notEmpty().withMessage("Occasion is required"),
    body("message").notEmpty().withMessage("Message is required"),

    validatorMiddleware,
  ];
}
