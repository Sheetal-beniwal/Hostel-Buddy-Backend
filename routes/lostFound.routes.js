import { Router } from "express";
import { createLostFoundItem, deleteItem, getAllItems, getItemByID, updateStatus } from "../controllers/lostFound.controller.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const lostFoundRouter = Router();
lostFoundRouter.route('/create').post(verifyJWT,upload.single("itemPic") , createLostFoundItem)
lostFoundRouter.route('/all').get(getAllItems);
lostFoundRouter.route('/:id').get(getItemByID);
lostFoundRouter.route('/updateStatus/:id').post(verifyJWT, updateStatus);
lostFoundRouter.route('/deleteItem/:id').delete(verifyJWT,isAdmin, deleteItem);