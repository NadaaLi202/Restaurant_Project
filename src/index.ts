import express, { Application } from "express";
import subcategoryRouter from "./subcategories/subcategory.router";
import categoriesRouter from "./categories/categories.route";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import productRouter from "./products/product.router";


declare module "express" {


    interface Request {

        filterData ? : any
        files ? : any
    }
}

    
const Routes : (app : Application) => void = (app: express.Application) : void => {

    app.use('/api/v1/categories', categoriesRouter);
    app.use('/api/v1/subcategories', subcategoryRouter);
    app.use('/api/v1/products',productRouter);
    
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {
        
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

