import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import usersSchema from "./users.schema";
import { IUsers } from "./users.interface";
import refactorService from "../refactor.service";
import ApiErrors from "../utils/apiErrors";
import { uploadSingleFile } from "../middleware/uploadFiles.middleware";
import sharp from "sharp";
import bcrypt from "bcryptjs";

class UsersService {
  getAll = refactorService.getAll<IUsers>(usersSchema, "users");
  createOne = refactorService.createOne<IUsers>(usersSchema);
  getOne = refactorService.getOne<IUsers>(usersSchema);
  updateOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findOneAndUpdate(
        { _id: req.params.id, hasPassword: false },
        {
          name: req.body.name,
          image: req.body.image,
          active: req.body.active,
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ data: user });
    }
  );
  deleteOne = refactorService.deleteOne<IUsers>(usersSchema);

  changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUsers | null = await usersSchema.findByIdAndUpdate(
        req.params.id,
        {
          password: await bcrypt.hash(req.body.password, 13),
          passwordChangedAt: Date.now(),
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ data: user });
    }
  );

  uploadImage = uploadSingleFile(["image"], "image");
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const fileName: string = `user-${Date.now()}-image.webp`;
      await sharp(req.file.buffer)
        .resize(1200, 1200)
        .webp({ quality: 95 })
        .toFile(`uploads/images/users/${fileName}`);
      req.body.image = fileName;
    }
    next();
  };
}

const usersService = new UsersService();
export default usersService;
