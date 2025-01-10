import { Router } from "express";
import orderService from "./order.service";

const paymentRouter: Router = Router();

paymentRouter.post("/", orderService.createOnlineOrder);

export default paymentRouter;
