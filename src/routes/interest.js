import express from "express";

import {
    createInterestController,
    getReceivedInterestsController,
    getSentInterestsController
} from "../controllers/interestController.js";

import authMiddleware from "../middlewares/auth.js";

const interestRouter = express.Router();

interestRouter.get(
    "/received",
    authMiddleware,
    getReceivedInterestsController
);

interestRouter.get(
    "/sent",
    authMiddleware,
    getSentInterestsController
);

interestRouter.post(
    "/:toUserId",
    authMiddleware,
    createInterestController
);

export default interestRouter;