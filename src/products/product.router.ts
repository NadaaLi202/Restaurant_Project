import { Router } from "express";
import productsService from "./product.service";
import productsValidation from "./product.validation";
import reviewsRoute from "../reviews/reviews.routes";
import authService from "../auth/auth.services";

const productsRoute: Router = Router();

productsRoute.use("/:productId/reviews", reviewsRoute);

productsRoute
  .route("/")
  .get(productsService.getAll)
  .post(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin"),
    productsService.uploadImages,
    productsService.saveImage,
    productsValidation.createOne,
    productsService.createOne
  );

productsRoute
  .route("/:id")
  .get(productsValidation.getOne, productsService.getOne)
  .put(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin"),
    productsService.uploadImages,
    productsService.saveImage,
    productsValidation.updateOne,
    productsService.updateOne
  )
  .delete(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin"),
    productsValidation.deleteOne,
    productsService.deleteOne
  );

export default productsRoute;
