import AppError from "../utils/AppError.js";

export const hostOnly = (req, res, next) => {
    if (req.user.role !== "host") {
        throw new AppError(
            "Only hosts can manage listings",
            403
        );
    }

    next();
};

