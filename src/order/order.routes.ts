import { Router } from "express";
import orderService from "./order.service";
import authService from "../auth/auth.services";

const orderRouter: Router = Router();

orderRouter.use(authService.protectedRoutes, authService.checkActive);

orderRouter
  .route("/")
  .get(orderService.filterOrders, orderService.getAll)
  .post(authService.allowedTo("user"), orderService.createCashOrder);

orderRouter.put(
  "/:id/deliver",
  authService.allowedTo("admin", "employee"),
  orderService.deliverOrder
);
orderRouter.put(
  "/:id/pay",
  authService.allowedTo("admin", "employee"),
  orderService.payOrder
);

export default orderRouter;
