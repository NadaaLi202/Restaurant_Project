import { body, param } from "express-validator";
import cartSchema from "./cart.schema"; // Import cartSchema
import validatorMiddleware from "../middleware/validator.middleware";

class CartValidation {
  // Validation for creating a new cart item
  createOne = [
    body("productId")
      .notEmpty()
      .withMessage((val, { req }) => req.__("product_id_required")) // Ensure productId is provided
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_product_id")) // Validate productId format
      .custom(async (val: string, { req }) => {
        const cartItem = await cartSchema.findOne({
          productId: val,
          userId: req.user.id,
        }); // Check if product exists for the user
        if (cartItem) {
          throw new Error(req.__("product_already_in_cart")); // Ensure no duplicate product in cart
        }
        return true;
      }),
    body("quantity")
      .notEmpty()
      .withMessage((val, { req }) => req.__("quantity_required")) // Ensure quantity is provided
      .isInt({ min: 1 })
      .withMessage((val, { req }) => req.__("quantity_invalid")), // Ensure quantity is a positive integer
    validatorMiddleware,
  ];

  // Validation for updating an existing cart item
  updateOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_cart_item_id")), // Validate cart item ID
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage((val, { req }) => req.__("quantity_invalid")) // Validate quantity if provided
      .custom(async (val: number, { req }) => {
        if (!req.params || !req.params.id) {
          throw new Error(req.__("invalid_request_parameters"));
        }
        const cartItem = await cartSchema.findById(req.params.id);
        if (!cartItem) {
          throw new Error(req.__("cart_item_not_found"));
        }
        return true;
      }),
    validatorMiddleware,
  ];

  // Validation for retrieving a specific cart item
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_cart_item_id")), // Validate cart item ID
    validatorMiddleware,
  ];

  // Validation for deleting a specific cart item
  deleteOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_cart_item_id")), // Validate cart item ID
    validatorMiddleware,
  ];
}

const cartValidation = new CartValidation();

export default cartValidation;
