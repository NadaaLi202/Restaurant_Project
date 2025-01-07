import { Router } from "express";
import productsService from "./product.service";
import productsValidation from "./product.validation";


const productRouter : Router = Router();

productRouter.post('/',productsService.uploadImages,productsService.saveImage,productsValidation.createOne,productsService.createProduct)
productRouter.get('/',productsService.getAllProducts)
productRouter.get('/:id',productsValidation.getOne,productsService.getProductById)
productRouter.put('/:id',productsService.uploadImages,productsService.saveImage,productsValidation.updateOne,productsService.updateProduct)
productRouter.delete('/:id',productsValidation.deleteOne,productsService.deleteProduct)

export default productRouter;