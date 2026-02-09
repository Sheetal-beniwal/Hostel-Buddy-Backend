import {Router} from 'express';
import { register,loginUser,logoutUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/userAuth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router()

router.route('/register').post(upload.single("profilePic"), register);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);

export default router;