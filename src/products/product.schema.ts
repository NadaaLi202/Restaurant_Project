import mongoose from "mongoose";
import { Products } from "./product.interface";


const productsSchema = new mongoose.Schema<Products>({

    name : {
        type : String,
        required : true,
        trim : true
    },

    cover : {
        type : String,
        trim : true
    },

    images : {      

        type : [String],
        trim : true
    },
    
    discount : {
        type : Number,
        min : 0,
        max : 100
    },

    priceAfterDiscount : {
        type : Number,
        min : 0
    },

    sold : {
        type : Number,      
        min : 0,
        default : 0
    },

    rating : {
        type : Number,
        min : 0,
        max : 5,
        default : 0
    },

    rateAvg : {
        type : Number,
        min : 0,
        max : 5
    },

    description : {
        type : String,
        required : true,
        trim : true
    },

    price : {
        type : Number,
        required : true,
        min : 0
    },

    quantity : {
        type : Number,
        required : true,
        min : 0,
        default : 0
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Categories',
        required: true
    },
    subcategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Subcategories',
        required: true
    },


},{timestamps : true})

productsSchema.pre<Products>(/^find/, function(next)  {

    this.populate({path : 'subcategory', select : ' -_id name'});
    next();
    
    
    })


export default mongoose.model<Products>('Products',productsSchema);