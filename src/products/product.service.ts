import { NextFunction, Request, Response } from "express";
import refactorService from "../refactor.service";
import { Products } from "./product.interface";
import productSchema from "./product.schema";
import sharp from "sharp";
import { uploadMultiFiles } from "../middleware/uploadFiles.middleware";



class ProductsService {

  getAllProducts =  refactorService.getAll<Products>(productSchema,'Products');
  createProduct = refactorService.createOne<Products>(productSchema);
  getProductById = refactorService.getOneById<Products>(productSchema);
  updateProduct = refactorService.updateOne<Products>(productSchema);
  deleteProduct = refactorService.deleteOne<Products>(productSchema);
  
  uploadImages = uploadMultiFiles(['image'],[{ name: 'images' , maxCount: 5}, { name: 'cover', maxCount: 1 }]);
   saveImage = async (req: Request, res: Response, next: NextFunction) =>   {

    if (req.files) {
      if(req.files.cover){
        const fileName = `products.${Date.now()}-cover.webp`;
        await sharp(req.files.cover[0].buffer)
          .resize(1200, 1200)
          .webp({ quality: 95 })
          .toFile(`uploads/images/products/${fileName}`);
        req.body.cover = fileName;
      }

      if (req.files.images) {
        req.body.images = [];
        await Promise.all(req.files.images.map(async (image: any, index: number) => {
            const fileName: string = `product-${Date.now()}-image-N${index + 1}.webp`;
            await sharp(image.buffer)
                .resize(1200, 1200)
                .webp({quality: 95})
                .toFile(`uploads/images/products/${fileName}`);
            req.body.images.push(fileName);
        }));
    }
}
next();

  }

}

const productsService = new ProductsService();

export default productsService;