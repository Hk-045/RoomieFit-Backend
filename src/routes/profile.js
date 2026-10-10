import express from "express";

import {
    createProfileController,
    getMyProfileController,
    updateProfileController,
    getAllProfilesController
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/auth.js";

const profileRouter = express.Router();

profileRouter.post(
    "/",
    authMiddleware,
    createProfileController
);

profileRouter.patch(
    "/me",
    authMiddleware,
    updateProfileController
);

profileRouter.get(
    "/me",
    authMiddleware,
    getMyProfileController
);

profileRouter.get(
    "/",
    authMiddleware,
    getAllProfilesController
);

export default profileRouter;