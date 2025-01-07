import  { Router } from "express";
import categoriesService from "./categories.service";
import subcategoryRouter from "../subcategories/subcategory.router";
import categoriesValidation from "./category.validation";

const categoriesRouter : Router =  Router();

// categoriesRouter.get('/',categoriesService.getAllCategories);
// categoriesRouter.post('/',categoriesService.createCategory);

// /api/v1/categories/:categoryId/subcategories
categoriesRouter.use('/:categoryId/subcategories',subcategoryRouter); // view all subcategories
categoriesRouter.route('/')
.get(categoriesService.getAllCategories)
.post(categoriesValidation.createOne,categoriesService.createCategory)
 categoriesRouter.get('/:id',categoriesValidation.getOne,categoriesService.getCategoryById);
 categoriesRouter.put('/:id',categoriesValidation.updateOne,categoriesService.updateCategory);
 categoriesRouter.delete('/:id',categoriesValidation.deleteOne,categoriesService.deleteCategory);


export default categoriesRouter;


