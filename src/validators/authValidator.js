import validator from "validator";
import AppError from "../utils/AppError.js";

export const signupValidator = (data) => {
    if (!data || typeof data !== "object") {
        throw new AppError("Request body is required", 400);
    }

    const allowedFields = ["name", "email", "password", "role", "image"];
    const fields = Object.keys(data);

    const invalidFields = fields.filter(
        (item) => !allowedFields.includes(item)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `Invalid fields: ${invalidFields.join(", ")}`,
            400
        );
    }

    if (
        typeof data.name !== "string" ||
        !data.name.trim()
    ) {
        throw new AppError("Name is required", 400);
    }

    if (
        typeof data.email !== "string" ||
        !validator.isEmail(data.email)
    ) {
        throw new AppError("Valid email is required", 400);
    }

    if (
        !data.password ||
        typeof data.password !== "string" ||
        !validator.isStrongPassword(data.password)
    ) {
        throw new AppError(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
            400
        );
    }

    if (
        !data.role ||
        !["seeker", "host"].includes(data.role)
    ) {
        throw new AppError("Invalid role", 400);
    }

    if (
        data.image !== undefined &&
        (typeof data.image !== "string" || !data.image.trim())
    ) {
        throw new AppError("Invalid image", 400);
    }
};

export const loginValidator = (data) => {
    if (!data || typeof data !== "object") {
        throw new AppError("Request body is required", 400);
    }

    const allowedFields = ["email", "password"];
    const fields = Object.keys(data);

    const extraFields = fields.filter(
        (item) => !allowedFields.includes(item)
    );

    if (extraFields.length > 0) {
        throw new AppError(
            `Invalid fields: ${extraFields.join(", ")}`,
            400
        );
    }

    if (
        typeof data.email !== "string" ||
        !validator.isEmail(data.email)
    ) {
        throw new AppError("Valid email is required", 400);
    }

    if (
        !data.password ||
        typeof data.password !== "string"
    ) {
        throw new AppError("Password is required", 400);
    }
};