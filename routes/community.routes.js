import { Router } from "express";
import { createCommunity, getAllCommunities, getCommunityById, joinCommunity } from "../controllers/community.controller.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";

export const communityRouter = Router();
communityRouter.route('/create').post(verifyJWT, createCommunity);
communityRouter.route('/all').get(getAllCommunities);
communityRouter.route('/:id').get(getCommunityById)
communityRouter.route('/join/:id').post(verifyJWT, joinCommunity)