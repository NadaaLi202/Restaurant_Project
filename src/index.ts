import express, { Application } from "express";
import categoriesRouter from "./categories/categories.route";
import subcategoriesRoute from "./subcategories/subcategory.router";
import globalErrors from "./middleware/errors.middleware";
import ApiErrors from "./utils/apiErrors";
import productsRoute from "./products/product.router";
import usersRoute from "./users/users.route";
import authRoute from "./auth/auth.route";
import profileRoute from "./profile/profile.route";
import googleRoute from "./google/google.routes";
import wishlistRoute from "./wishlist/wishlist.routes";
import reviewsRoute from "./reviews/reviews.routes";
import cartRoute from "./cart/cart.routes";
import orderRoute from "./order/order.routes";
import bookingRouter from "./booking/booking.routes";

declare module "express" {
  interface Request {
    filterData?: any;
    files?: any;
    user?: any;
  }
}

const mountRoutes: (app: Application) => void = (app: express.Application) => {
  app.use("/auth/google", googleRoute);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRoute);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/profile", profileRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/booking", bookingRouter);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
  app.all(
    "*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      next(new ApiErrors(`route ${req.originalUrl} not found`, 400));
    }
  );
  app.use(globalErrors);
};
export default mountRoutes;
