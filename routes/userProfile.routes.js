import { Router } from "express";
import { editProfile, getownProfile, getProfile } from "../controllers/userProfile.controller.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

export const userProfileRouter = Router();

userProfileRouter.route('/getProfile/:id').get(getProfile);
userProfileRouter.route('/getownProfile').get(verifyJWT,getownProfile)
userProfileRouter.route('/editProfile').post(verifyJWT,upload.single("profilePic"), editProfile)