import User from "../models/User.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

import {
    signupValidator,
    loginValidator
} from "../validators/authValidator.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
};

export const signupController = async (req, res) => {
    signupValidator(req.body);

    const {
        name,
        email,
        password,
        role,
        image
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
        throw new AppError("Email already exists", 409);
    }

    const user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        image: image?.trim()
    });

    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("Email already exists", 409);
        }

        throw error;
    }

    res.status(201).json({
        message: "User created successfully"
    });
};

export const loginController = async (req, res) => {
    loginValidator(req.body);

    const {
        email,
        password
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
        }
    });
};

export const logoutController = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        message: "Logout successful"
    });
};