import { body, param } from "express-validator";
import categoriesSchema from "../categories/categories.schema";
import validatorMiddleware from "../middleware/validator.middleware";
import subcategoriesSchema from "../subcategories/subcategory.schema";

class ProductsValidation {
    createOne = [
        body('name')
            .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
            .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short')),
        body('description')
            .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
            .isLength({ min: 2, max: 500 }).withMessage((val, { req }) => req.__('validation_length_long')),
        body('price')
            .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
            .isFloat({ min: 1, max: 10000000 }).withMessage((val, { req }) => req.__('validation_value')),
        body('quantity').optional()
            .isInt({ min: 1, max: 10000000 }).withMessage((val, { req }) => req.__('validation_value')),
        body('discount').optional()
            .isFloat({ min: 1, max: 100 }).withMessage((val, { req }) => req.__('validation_value'))
            .custom((val, { req }) => {
                req.body.priceAfterDiscount = req.body.price - (req.body.price * val / 100);
                return true;
            }),
        body('category')
            .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
            .isMongoId().withMessage((val, { req }) => req.__('invalid_id'))
            .custom(async (val: string, { req }) => {
                const category = await categoriesSchema.findById(val);
                if (!category) throw new Error(`${req.__('validation_value')}`);
                return true;
            }),

            body('subcategory')
            .notEmpty().withMessage((val, {req}) => req.__('validation_field'))
            .isMongoId().withMessage((val, {req}) => req.__('invalid_id'))
            .custom(async (val: string, {req}) => {
                const subcategory = await subcategoriesSchema.findById(val);
                if (!subcategory || subcategory.category._id!.toString() !== req.body.category.toString()) throw new Error(`${req.__('validation_value')}`);
                return true;
            }),
        validatorMiddleware
    ]

    updateOne = [
        param('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
        body('name').optional()
            .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short')),
        body('description').optional()
            .isLength({ min: 2, max: 500 }).withMessage((val, { req }) => req.__('validation_length_long')),
        body('price').optional()
            .isFloat({ min: 1, max: 10000000 }).withMessage((val, { req }) => req.__('validation_value')),
        body('quantity').optional()
            .isInt({ min: 1, max: 10000000 }).withMessage((val, { req }) => req.__('validation_value')),
        body('discount').optional()
            .isFloat({ min: 1, max: 100 }).withMessage((val, { req }) => req.__('validation_value'))
            .custom((val, { req }) => {
                req.body.priceAfterDiscount = req.body.price - (req.body.price * val / 100);
                return true;
            }),
        body('category').optional()
            .isMongoId().withMessage((val, { req }) => req.__('invalid_id'))
            .custom(async (val: string, { req }) => {
                const category = await categoriesSchema.findById(val);
                if (!category) throw new Error(`${req.__('validation_value')}`);
                return true;
            }),
        body('subcategory').optional()
            .isMongoId().withMessage((val, { req }) => req.__('invalid_id'))
            .custom(async (val: string, { req }) => {
                const subcategory = await subcategoriesSchema.findById(val);
                if (!subcategory || !subcategory.category || subcategory.category._id!.toString() !== req.body.category.toString()) {
                    throw new Error(`${req.__('validation_value')}`);
                }
                return true;
            }),
        validatorMiddleware
    ]

    getOne = [
        param('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
        validatorMiddleware
    ]

    deleteOne = [
        param('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
        validatorMiddleware
    ]
}

const productsValidation = new ProductsValidation();

export default productsValidation;