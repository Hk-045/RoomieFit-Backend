import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const createInterestValidator = (
    toUserId,
    listingId
) => {
    if (!toUserId) {
        throw new AppError(
            "Target user is required",
            400
        );
    }

    if (!mongoose.isValidObjectId(toUserId)) {
        throw new AppError(
            "Invalid target user ID",
            400
        );
    }

    if (
        listingId !== undefined &&
        !mongoose.isValidObjectId(listingId)
    ) {
        throw new AppError(
            "Invalid listing ID",
            400
        );
    }
};