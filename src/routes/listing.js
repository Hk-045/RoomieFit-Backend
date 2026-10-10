import express from "express";

import {
    createListingController,
    getListingsController,
    getListingByIdController,
    getMyListingsController,
    updateListingController,
    deleteListingController
} from "../controllers/listingController.js";

import authMiddleware from "../middlewares/auth.js";
import { hostOnly } from "../middlewares/hostOnly.js";

const listingRouter = express.Router();

listingRouter.post(
    "/",
    authMiddleware,
    hostOnly,
    createListingController
);

listingRouter.get(
    "/",
    authMiddleware,
    getListingsController
);

listingRouter.get(
    "/my",
    authMiddleware,
    hostOnly,
    getMyListingsController
);

listingRouter.get(
    "/:id",
    authMiddleware,
    getListingByIdController
);

listingRouter.patch(
    "/:id",
    authMiddleware,
    hostOnly,
    updateListingController
);

listingRouter.delete(
    "/:id",
    authMiddleware,
    hostOnly,
    deleteListingController
);

export default listingRouter;