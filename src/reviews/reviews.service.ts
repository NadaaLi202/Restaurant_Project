import { NextFunction, Request, Response } from "express";
import { IReviews } from "./reviews.interface";
import reviewsSchema from "./reviews.schema";
import refactorService from "../refactor.service";

class ReviewsService {
  setIds(req: Request & { user?: any }, res: Response, next: NextFunction) {
    if (req.user) {
      req.body.user = req.user._id;
    }
    req.body.product = req.params.productId;
    next();
  }

  filterReviews(
    req: Request & { user?: any; filterData?: any },
    res: Response,
    next: NextFunction
  ) {
    const filterData: any = {};
    if (req.params.productId) filterData.product = req.params.productId;
    if (!req.params.productId && req.user && req.user.role === "user")
      filterData.user = req.user._id;
    req.filterData = filterData;
    next();
  }
  getAll = refactorService.getAll<IReviews>(reviewsSchema);
  createOne = refactorService.createOne<IReviews>(reviewsSchema);
  getOne = refactorService.getOne<IReviews>(reviewsSchema);
  updateOne = refactorService.updateOne<IReviews>(reviewsSchema);
  deleteOne = refactorService.deleteOne<IReviews>(reviewsSchema);
}

const reviewsService = new ReviewsService();
export default reviewsService;
