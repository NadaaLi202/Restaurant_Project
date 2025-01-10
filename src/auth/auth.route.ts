import { Router } from "express";
import authService from "./auth.services";
import authValidation from "./auth.validation";

const authRouter: Router = Router();

authRouter.post("/signup", authValidation.signup, authService.signup);
authRouter.post("/login", authValidation.login, authService.login);
authRouter.post(
  "/admin-login",
  authValidation.forgetPassword,
  authService.adminLogin
);
authRouter.post(
  "/forget-password",
  authValidation.forgetPassword,
  authService.forgetPassword
);
authRouter.post("/verify-code", authService.verifyResetCode);
authRouter.post(
  "/reset-password",
  authValidation.changePassword,
  authService.resetPassword
);

export default authRouter;
