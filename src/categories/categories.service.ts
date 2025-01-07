import {Request, Response, NextFunction } from "express";
import { Categories } from "./categories.interface";
import categoriesSchema from "./categories.schema";
import expressAsyncHandler from "express-async-handler";

class CategoriesService {

   getAllCategories : any =  expressAsyncHandler (async (req : Request, res : Response , next : NextFunction) : Promise <void> => {

        const categories : Categories[] = await categoriesSchema.find();
        res.status(200).json({message : "All categories fetched successfully",  categories});
    })

    getCategoryById : any = expressAsyncHandler(async (req : Request, res : Response , next : NextFunction) : Promise <void> => {

        const category : Categories | null = await categoriesSchema.findById(req.params.id);
        if(!category) {
            res.status(404).json({message : "Category not found"});
        }
        res.status(200).json({message: "Category found successfully", category});
    })
 
    createCategory: any =  expressAsyncHandler(  async  (req : Request, res : Response , next : NextFunction)  : Promise <void>  =>{

        const category : Categories = await categoriesSchema.create(req.body);
        if(!category) {
             res.status(400).json({message : "Category not created"});
        }
        res.status(201).json({message: "Category created successfully", category});
    })

    updateCategory : any = expressAsyncHandler( async (req : Request, res : Response , next : NextFunction) : Promise <void> => {
        
        const category : Categories | null = await categoriesSchema.findByIdAndUpdate(req.params.id, req.body ,{new : true})
        if(!category){
            res.status(400).json({message : "Category not updated"});
        }
        res.status(200).json({message : "Category updated successfully", category});
    })

    deleteCategory : any = expressAsyncHandler (async (req : Request, res : Response , next : NextFunction) : Promise <void> => {
        
        const category : Categories | null = await categoriesSchema.findByIdAndDelete(req.params.id);
        if(!category){
            res.status(400).json({message : "Category not deleted"});
        }
        res.status(200).json({message : "Category deleted successfully", category});
    })

}

const categoriesService = new CategoriesService();

export default categoriesService;