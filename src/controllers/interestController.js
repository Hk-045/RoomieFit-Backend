import Interest from "../models/Interest.js";
import Listing from "../models/Listing.js";
import Profile from "../models/Profile.js";
import AppError from "../utils/AppError.js";

import {
    createInterestValidator
} from "../validators/interestValidator.js";

import calculateCompatibility from "../utils/compatibility.js";

export const createInterestController = async (req, res) => {
    const { _id: fromUserId } = req.user;
    const { toUserId } = req.params;
    const { listingId } = req.body;

    createInterestValidator(
        toUserId,
        listingId
    );

    if (
        fromUserId.toString() ===
        toUserId.toString()
    ) {
        throw new AppError(
            "You cannot express interest in yourself",
            400
        );
    }

    if (listingId) {
        const listing = await Listing.findOne({
            _id: listingId,
            ownerId: toUserId
        });

        if (!listing) {
            throw new AppError(
                "Listing not found or you are not the owner",
                404
            );
        }

        const existingInterest =
            await Interest.findOne({
                fromUserId,
                listingId
            });

        if (existingInterest) {
            throw new AppError(
                "You have already expressed interest in this listing",
                409
            );
        }

        const interest = new Interest({
            fromUserId,
            toUserId,
            listingId
        });

        try {
            await interest.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError(
                    "You have already expressed interest in this listing",
                    409
                );
            }

            throw error;
        }

        return res.status(201).json({
            message: "Interest expressed successfully",
            interest: {
                id: interest._id,
                listingId: interest.listingId,
                toUserId: interest.toUserId
            }
        });
    }

    const targetProfile =
        await Profile.findOne({
            userId: toUserId,
            profileComplete: true
        });

    if (!targetProfile) {
        throw new AppError(
            "Target user profile not found",
            404
        );
    }

    const myProfile =
        await Profile.findOne({
            userId: fromUserId,
            profileComplete: true
        });

    if (!myProfile) {
        throw new AppError(
            "Your profile not found",
            404
        );
    }

    const existingInterest =
        await Interest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

    if (existingInterest) {
        throw new AppError(
            "You have already expressed interest in this user",
            409
        );
    }

    const compatibilityScore =
        calculateCompatibility(
            myProfile,
            targetProfile
        );

    const [user1, user2] = [
        fromUserId.toString(),
        toUserId.toString()
    ].sort();

    const interest = new Interest({
        fromUserId,
        toUserId,
        user1,
        user2,
        compatibilityScore
    });

    try {
        await interest.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "You have already expressed interest in this user",
                409
            );
        }

        throw error;
    }

    return res.status(201).json({
        message: "Interest expressed successfully",
        interest: {
            id: interest._id,
            toUserId: interest.toUserId,
            compatibilityScore:
                interest.compatibilityScore
        }
    });
};

export const getReceivedInterestsController = async (
    req,
    res
) => {
    const { _id: userId } = req.user;

    const interests = await Interest.find({
        toUserId: userId
    })
        .populate(
            "fromUserId",
            "name image"
        )
        .populate(
            "listingId",
            "title city roomType rent deposit photo address"
        )
        .sort({
            createdAt: -1
        });

    const formattedInterests = interests.map(
        (interest) => ({
            id: interest._id,
            fromUser: interest.fromUserId
                ? {
                    id: interest.fromUserId._id,
                    name: interest.fromUserId.name,
                    image: interest.fromUserId.image
                }
                : null,
            listing: interest.listingId
                ? {
                    id: interest.listingId._id,
                    title: interest.listingId.title,
                    city: interest.listingId.city,
                    roomType: interest.listingId.roomType,
                    rent: interest.listingId.rent,
                    deposit: interest.listingId.deposit,
                    photo: interest.listingId.photo,
                    address: interest.listingId.address
                }
                : null,
            compatibilityScore:
                interest.compatibilityScore,
            createdAt: interest.createdAt
        })
    );

    res.status(200).json({
        interests: formattedInterests
    });
};

export const getSentInterestsController = async (
    req,
    res
) => {
    const { _id: userId } = req.user;

    const interests = await Interest.find({
        fromUserId: userId
    })
        .populate(
            "toUserId",
            "name image"
        )
        .populate(
            "listingId",
            "title city roomType rent deposit photo address"
        )
        .sort({
            createdAt: -1
        });

    const formattedInterests = interests.map(
        (interest) => ({
            id: interest._id,
            toUser: interest.toUserId
                ? {
                    id: interest.toUserId._id,
                    name: interest.toUserId.name,
                    image: interest.toUserId.image
                }
                : null,
            listing: interest.listingId
                ? {
                    id: interest.listingId._id,
                    title: interest.listingId.title,
                    city: interest.listingId.city,
                    roomType: interest.listingId.roomType,
                    rent: interest.listingId.rent,
                    deposit: interest.listingId.deposit,
                    photo: interest.listingId.photo,
                    address: interest.listingId.address
                }
                : null,
            compatibilityScore:
                interest.compatibilityScore,
            createdAt: interest.createdAt
        })
    );

    res.status(200).json({
        interests: formattedInterests
    });
};