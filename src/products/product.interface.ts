import { Categories } from "../categories/categories.interface";
import { Document } from "mongoose";
import { Subcategories } from "../subcategories/subcategory.interface";

export interface Products extends Document {

    readonly name : string;
    readonly description : string;
    readonly category : Categories;
    readonly subcategory : Subcategories;
    readonly price : number;
    readonly discount : number;
    readonly priceAfterDiscount : number;
    readonly quantity : number;
    readonly sold : number;
    readonly rating : number;
    readonly rateAvg : number;
     images : string[];
     cover : string;
}