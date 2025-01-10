import { body, param } from "express-validator";
import validatorMiddleware from "../middleware/validator.middleware";
class OrderValidation {
  createCashOrder = [
    body("address")
      .notEmpty()
      .withMessage("Shipping address is required")
      .isString()
      .withMessage("Shipping address must be a string"),
    validatorMiddleware,
  ];
  createOnlineOrder = [
    body("obj.payment_key_claims.extra.token")
      .notEmpty()
      .withMessage("Payment token is required")
      .isString()
      .withMessage("Payment token must be a string"),
    body("obj.payment_key_claims.extra.address")
      .notEmpty()
      .withMessage("Shipping address is required")
      .isString()
      .withMessage("Shipping address must be a string"),
    validatorMiddleware,
  ];
  orderAction = [
    param("orderId")
      .notEmpty()
      .withMessage("Order ID is required")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    body("action")
      .notEmpty()
      .withMessage("Action is required")
      .isIn(["cancel", "return"])
      .withMessage((val, { req }) => req.__("validation_value")),
    validatorMiddleware,
  ];
}

const orderValidation = new OrderValidation();

export default orderValidation;
