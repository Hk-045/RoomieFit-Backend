import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            throw new AppError(
                "Invalid or expired token",
                401
            );
        }

        throw error;
    }

    const user = await User.findById(
        decoded.id
    ).select("-password");

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    req.user = user;

    next();
};

export default authMiddleware;