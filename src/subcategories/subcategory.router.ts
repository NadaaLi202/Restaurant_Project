import { Router } from "express";
import subcategoriesService from "./subcategory.service";
import subcategoriesValidation from "./subcategories.validation";



const subcategoryRouter : Router = Router({mergeParams : true}) ;

subcategoryRouter.post('/',subcategoriesService.setCategoryId,subcategoriesValidation.createOne,subcategoriesService.createSubcategory)
subcategoryRouter.get('/',subcategoriesService.filterSubcategories,subcategoriesService.getAllSubcategories)
subcategoryRouter.get('/:id',subcategoriesValidation.getOne,subcategoriesService.getSubcategoryById)
subcategoryRouter.put('/:id',subcategoriesValidation.updateOne,subcategoriesService.updateSubcategory)
subcategoryRouter.delete('/:id',subcategoriesValidation.deleteOne,subcategoriesService.deleteSubcategory)


export default subcategoryRouter;