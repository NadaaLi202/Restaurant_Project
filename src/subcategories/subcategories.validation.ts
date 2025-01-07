import { body, param } from "express-validator";
import validatorMiddleware from "../middleware/validator.middleware";
import categoriesSchema from "../categories/categories.schema";


class SubcategoriesValidation {

    createOne = [body('name')
        .notEmpty().withMessage('Subcategory name is required')
        .isLength({min : 2, max : 50}).withMessage('name must be at least 3 characters long'),

        body('category')
        .notEmpty().withMessage('category id is required')
        .isMongoId().withMessage('Invalid category id')
        .custom(async( val: string) => {
            
            const category = await categoriesSchema.findById(val);
            if(!category) throw new Error('Category not found');
            return true;
        }), 
        validatorMiddleware ]

        updateOne = [
            param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
            body('name').optional()
                .isLength({min: 2, max: 50}).withMessage((val, {req}) => req.__('validation_length_short')),
            body('category').optional()
                .isMongoId().withMessage((val, {req}) => req.__('invalid_id'))
                .custom(async (val: string, {req}) => {
                    const category = await categoriesSchema.findById(val);
                    if (!category) throw new Error(`${req.__('validation_value')}`);
                    return true;
                }),
            validatorMiddleware
        ]    

    getOne = [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
        validatorMiddleware]

    deleteOne =  [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
   validatorMiddleware ]
}

const subcategoriesValidation = new SubcategoriesValidation();

export default subcategoriesValidation;