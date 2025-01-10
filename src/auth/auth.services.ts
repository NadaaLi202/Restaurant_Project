import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";
import createTokens from "../utils/tokens";
import sanitization from "../utils/sanitization";
import sendMail from "../utils/sendMail";
import crypto from "node:crypto";

class AuthService {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, name, email, image, role } = req.body;

    let assignedRole = "user"; // Default role
    if (
      role === "admin" &&
      req.headers["x-admin-key"] === process.env.ADMIN_KEY
    ) {
      assignedRole = "admin";
    }

    const user = await usersSchema.create({
      username,
      password,
      name,
      email,
      image,
      role: assignedRole,
    });

    const token = createTokens.accessToken(user._id, user.role);
    res.status(201).json({ token, data: sanitization.User(user) });
  });

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({
        $or: [{ username: req.body.username }, { email: req.body.username }],
      });

      // Check if user exists and is of role "user"
      if (!user || user.role !== "user") {
        return next(new ApiErrors(`${req.__("invalid_login")}`, 400));
      }

      // Check if the user has a valid password
      if (
        user.hasPassword == false ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        return next(new ApiErrors(`${req.__("invalid_login")}`, 400));
      }

      // Generate token and respond
      const token = createTokens.accessToken(user._id, user.role);
      res.status(200).json({ token, data: sanitization.User(user) });
    }
  );

  adminLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Find the user with the "admin" role
      const user = await usersSchema.findOne({
        $or: [{ username: req.body.username }, { email: req.body.username }],
        role: "admin", // Ensure only admin role is allowed
      });

      // Check if user exists and the password is valid
      if (
        !user ||
        user.hasPassword === false ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        return next(new ApiErrors(`${req.__("invalid_login")}`, 400));
      }

      // Generate a token for the admin user
      const token = createTokens.accessToken(user._id, user.role);

      // Respond with token and sanitized user data
      res.status(200).json({ token, data: sanitization.User(user) });
    }
  );

  protectedRoutes = asyncHandler(
    async (
      req: Request & { user?: any },
      res: Response,
      next: NextFunction
    ) => {
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_login")}`, 401));

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await usersSchema.findById(decoded._id);
      if (!user) return next(new ApiErrors(`${req.__("check_login")}`, 401));

      if (user.passwordChangedAt instanceof Date) {
        const changedPasswordTime: number = Math.trunc(
          user.passwordChangedAt.getTime() / 1000
        );
        if (changedPasswordTime > decoded.iat)
          return next(
            new ApiErrors(`${req.__("check_password_changed")}`, 401)
          );
      }

      req.user = user;
      next();
    }
  );
  forgetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({ email: req.body.email });
      if (!user) return next(new ApiErrors(`${req.__("check_email")}`, 404));
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const cryptCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
      const mailOptions = {
        email: user.email,
        subject: `${req.__("reset_password")}`,
        message: `${req.__("reset_password_message")} ${resetCode}`,
      };
      let token: string;
      try {
        await sendMail(mailOptions);
        user.passwordResetCode = cryptCode;
        user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
        user.passwordResetCodeVerify = false;
        if (user.image && user.image.startsWith(`${process.env.BASE_URL}`)) {
          const newImage = user.image.split("/").pop();
          if (newImage) {
            user.image = newImage;
          }
        }
        await user.save({ validateModifiedOnly: true });
      } catch (error) {
        console.log(error);
        return next(new ApiErrors(`${req.__("check_email")}`, 500));
      }
      token = createTokens.resetToken(user._id);
      res.status(200).json({ token, success: true });
    }
  );
  verifyResetCode = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_login")}`, 401));
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const hashResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");
      const user = await usersSchema.findOne({
        _id: decoded._id,
        passwordResetCode: hashResetCode,
        passwordResetCodeExpires: { $gt: Date.now() },
      });
      if (!user) return next(new ApiErrors(`${req.__("check_code")}`, 400));
      user.passwordResetCodeVerify = true;

      if (user.image && user.image.startsWith(`${process.env.BASE_URL}`)) {
        const newImage = user.image.split("/").pop();
        if (newImage) {
          user.image = newImage;
        }
      }
      await user.save({ validateModifiedOnly: true });
      res.status(200).json({ success: true });
    }
  );
  resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_reset_code")}`, 401));
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await usersSchema.findOne({
        _id: decoded._id,
        passwordResetCodeVerify: true,
      });
      if (!user)
        return next(new ApiErrors(`${req.__("check_code_verify")}`, 403));

      user.password = req.body.password;
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpires = undefined;
      user.passwordResetCodeVerify = undefined;
      user.passwordChangedAt = Date.now();
      if (user.image && user.image.startsWith(`${process.env.BASE_URL}`)) {
        const newImage = user.image.split("/").pop();
        if (newImage) {
          user.image = newImage;
        }
      }
      await user.save({ validateModifiedOnly: true });
      res.status(200).json({ success: true });
    }
  );
  allowedTo = (...roles: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !("role" in req.user) || !roles.includes(req.user.role))
        return next(new ApiErrors(`${req.__("allowed_to")}`, 403));
      next();
    });
  checkActive = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.active)
        return next(new ApiErrors(`${req.__("check_active")}`, 403));
      next();
    }
  );
}

const authService = new AuthService();
export default authService;
