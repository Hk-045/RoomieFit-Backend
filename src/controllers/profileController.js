import Profile from "../models/Profile.js";
import AppError from "../utils/AppError.js";

import {
    createProfileValidator,
    updateProfileValidator
} from "../validators/profileValidator.js";

import calculateCompatibility from "../utils/compatibility.js";

export const createProfileController = async (req, res) => {
    createProfileValidator(req.body);

    const { _id: userId } = req.user;

    const existingProfile = await Profile.findOne({
        userId
    });

    if (existingProfile) {
        throw new AppError(
            "Profile already exists",
            409
        );
    }

    const profile = new Profile({
        userId,
        ...req.body,
        currentCity: req.body.currentCity.trim(),
        targetCity: req.body.targetCity.trim(),
        bio: req.body.bio?.trim(),
        profileComplete: true
    });

    try {
        await profile.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "Profile already exists",
                409
            );
        }

        throw error;
    }

    res.status(201).json({
        message: "Profile created successfully",
        profile
    });
};

export const getMyProfileController = async (req, res) => {
    const { _id: userId } = req.user;

    const profile = await Profile.findOne({
        userId
    });

    if (!profile) {
        throw new AppError(
            "Profile not found",
            404
        );
    }

    res.status(200).json({
        profile
    });
};

export const updateProfileController = async (req, res) => {
    updateProfileValidator(req.body);

    const { _id: userId } = req.user;

    const profile = await Profile.findOne({
        userId
    });

    if (!profile) {
        throw new AppError(
            "Profile not found",
            404
        );
    }

    const updates = {
        ...req.body
    };

    if (updates.currentCity !== undefined) {
        updates.currentCity =
            updates.currentCity.trim();
    }

    if (updates.targetCity !== undefined) {
        updates.targetCity =
            updates.targetCity.trim();
    }

    if (updates.bio !== undefined) {
        updates.bio = updates.bio.trim();
    }

    Object.assign(profile, updates);

    await profile.save();

    res.status(200).json({
        message: "Profile updated successfully",
        profile
    });
};

export const getAllProfilesController = async (req, res) => {
    const { _id: userId } = req.user;

    const myProfile = await Profile.findOne({
        userId
    });

    if (!myProfile) {
        throw new AppError(
            "Profile not found",
            404
        );
    }

    const profiles = await Profile.find({
        userId: { $ne: userId },
        profileComplete: true,
        targetCity: myProfile.targetCity
    }).populate(
        "userId",
        "name image"
    );

    const profilesWithScores = profiles.map(
        (profile) => {
            const score = calculateCompatibility(
                myProfile,
                profile
            );

            return {
                user: {
                    id: profile.userId._id,
                    name: profile.userId.name,
                    image: profile.userId.image
                },
                profile: {
                    id: profile._id,
                    age: profile.age,
                    gender: profile.gender,
                    currentCity: profile.currentCity,
                    targetCity: profile.targetCity,
                    sleepSchedule: profile.sleepSchedule,
                    cleanliness: profile.cleanliness,
                    foodPreference: profile.foodPreference,
                    smoking: profile.smoking,
                    drinking: profile.drinking,
                    socializing: profile.socializing,
                    noiseTolerance: profile.noiseTolerance,
                    budgetMin: profile.budgetMin,
                    budgetMax: profile.budgetMax,
                    moveInDate: profile.moveInDate,
                    bio: profile.bio
                },
                compatibilityScore: score
            };
        }
    );

    profilesWithScores.sort(
        (a, b) =>
            b.compatibilityScore -
            a.compatibilityScore
    );

    res.status(200).json({
        profiles: profilesWithScores
    });
};