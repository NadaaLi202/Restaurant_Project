import { body, param } from "express-validator";
import categoriesSchema from "./categories.schema";
import validatorMiddleware from "../middleware/validator.middleware";


class CategoriesValidation {

    createOne = [body('name').notEmpty().withMessage((val, {req}) => req.__('validation_field'))
        .isLength({min : 2, max : 50}).withMessage('name must be at least 3 characters long')
        .custom(async( val: string, {req}) => {

        const category = await categoriesSchema.findOne({name : val});
        if(category) throw new Error(`${req.__('not_found')}`);
        return true;
    }), validatorMiddleware ]

    updateOne =  [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
        body('name').optional()
        .isLength({min : 2, max : 50}).withMessage('name must be at least 2 characters long')
        .custom(async( val: string, {req}) => {

        const category = await categoriesSchema.findOne({name : val});
        if(category && category._id!.toString() !== req.params?.id.toString()) throw new Error('Category already exists');
        return true;
    }), validatorMiddleware ]

    getOne = [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
        validatorMiddleware]

    deleteOne =  [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
   validatorMiddleware ]
}

const categoriesValidation = new CategoriesValidation();

export default categoriesValidation;