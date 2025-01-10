import {Router} from 'express';
import usersService from "./profile.service";
import usersValidation from "./profile.validation";
import authService from "../auth/auth.services";

const profileRouter: Router = Router();

profileRouter.use(authService.protectedRoutes, authService.checkActive);

profileRouter.route('/')
    .get(usersService.setUserId,usersService.getOne)
    .put(usersService.uploadImage, usersService.saveImage, usersValidation.updateOne, usersService.updateOne)
    .delete(authService.allowedTo('user'),usersValidation.deleteOne, usersService.deleteOne);

profileRouter.put('/create-password', usersValidation.changePassword, usersService.createPassword)
profileRouter.put('/change-password', usersValidation.changePassword, usersService.changePassword)

export default profileRouter;