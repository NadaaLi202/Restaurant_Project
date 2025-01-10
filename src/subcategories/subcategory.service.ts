import { NextFunction, Request, Response } from "express";
import { Subcategories } from "./subcategory.interface";
import refactorService from "../refactor.service";
import subcategorySchema from "./subcategory.schema";

class SubcategoriesService {
  setCategoryId(req: Request, res: Response, next: NextFunction): void {
    if (req.params.categoryId && !req.body.category)
      req.body.category = req.params.categoryId;
    next();
  }

  filterSubcategories(req: Request, res: Response, next: NextFunction): void {
    const filterData: any = {};
    if (req.params.categoryId) filterData.category = req.params.categoryId;
    req.filterData = filterData;
    next();
  }

  getAllSubcategories =
    refactorService.getAll<Subcategories>(subcategorySchema);
  createSubcategory =
    refactorService.createOne<Subcategories>(subcategorySchema);
  getSubcategoryById = refactorService.getOne<Subcategories>(subcategorySchema);
  updateSubcategory =
    refactorService.updateOne<Subcategories>(subcategorySchema);
  deleteSubcategory =
    refactorService.deleteOne<Subcategories>(subcategorySchema);
}

const subcategoriesService = new SubcategoriesService();

export default subcategoriesService;
