import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Profile from "../models/Profile.js";
import AppError from "../utils/AppError.js";

import {
    createListingValidator,
    updateListingValidator
} from "../validators/listingValidator.js";

export const createListingController = async (req, res) => {
    createListingValidator(req.body);

    const { _id: ownerId } = req.user;

    const address = req.body.address.trim();

    const existingListing = await Listing.findOne({
        ownerId,
        address
    });

    if (existingListing) {
        throw new AppError(
            "Listing already exists for this address",
            409
        );
    }

    const listing = new Listing({
        ...req.body,
        ownerId,
        title: req.body.title.trim(),
        city: req.body.city.trim(),
        description: req.body.description.trim(),
        address
    });

    try {
        await listing.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "Listing already exists for this address",
                409
            );
        }

        throw error;
    }

    res.status(201).json({
        message: "Listing created successfully",
        listing
    });
};

export const getListingsController = async (req, res) => {
    const {
        city,
        roomType,
        minRent,
        maxRent,
        availableFrom
    } = req.query;

    const filter = {
        status: "available"
    };

    if (city !== undefined) {
        if (
            typeof city !== "string" ||
            !city.trim()
        ) {
            throw new AppError(
                "Invalid city",
                400
            );
        }

        filter.city = city.trim();
    }

    if (roomType !== undefined) {
        if (
            !["single", "shared"].includes(roomType)
        ) {
            throw new AppError(
                "Invalid room type",
                400
            );
        }

        filter.roomType = roomType;
    }

    let minRentNumber;
    let maxRentNumber;

    if (minRent !== undefined) {
        minRentNumber = Number(minRent);

        if (
            Number.isNaN(minRentNumber) ||
            minRentNumber < 0
        ) {
            throw new AppError(
                "Invalid minimum rent",
                400
            );
        }
    }

    if (maxRent !== undefined) {
        maxRentNumber = Number(maxRent);

        if (
            Number.isNaN(maxRentNumber) ||
            maxRentNumber < 0
        ) {
            throw new AppError(
                "Invalid maximum rent",
                400
            );
        }
    }

    if (
        minRentNumber !== undefined &&
        maxRentNumber !== undefined &&
        minRentNumber > maxRentNumber
    ) {
        throw new AppError(
            "Minimum rent cannot be greater than maximum rent",
            400
        );
    }

    if (
        minRentNumber !== undefined ||
        maxRentNumber !== undefined
    ) {
        filter.rent = {};

        if (minRentNumber !== undefined) {
            filter.rent.$gte = minRentNumber;
        }

        if (maxRentNumber !== undefined) {
            filter.rent.$lte = maxRentNumber;
        }
    }

    if (availableFrom !== undefined) {
        const date = new Date(availableFrom);

        if (Number.isNaN(date.getTime())) {
            throw new AppError(
                "Invalid available from date",
                400
            );
        }

        filter.availableFrom = {
            $lte: date
        };
    }

    const listings = await Listing.find(filter)
        .populate("ownerId", "name image")
        .sort({ createdAt: -1 });

    res.status(200).json({
        listings
    });
};

export const getListingByIdController = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new AppError(
            "Invalid listing ID",
            400
        );
    }

    const listing = await Listing.findById(id)
        .populate("ownerId", "name image");

    if (!listing) {
        throw new AppError(
            "Listing not found",
            404
        );
    }

    const ownerProfile = await Profile.findOne({
        userId: listing.ownerId._id
    });

    res.status(200).json({
        listing,
        ownerProfile
    });
};

export const getMyListingsController = async (req, res) => {
    const { _id: ownerId } = req.user;

    const listings = await Listing.find({
        ownerId
    }).sort({ createdAt: -1 });

    res.status(200).json({
        listings
    });
};

export const updateListingController = async (req, res) => {
    updateListingValidator(req.body);

    const { _id: ownerId } = req.user;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new AppError(
            "Invalid listing ID",
            400
        );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new AppError(
            "Listing not found",
            404
        );
    }

    if (
        listing.ownerId.toString() !==
        ownerId.toString()
    ) {
        throw new AppError(
            "You are not allowed to update this listing",
            403
        );
    }

    const updates = {
        ...req.body
    };

    if (updates.title !== undefined) {
        updates.title = updates.title.trim();
    }

    if (updates.city !== undefined) {
        updates.city = updates.city.trim();
    }

    if (updates.description !== undefined) {
        updates.description =
            updates.description.trim();
    }

    if (updates.address !== undefined) {
        updates.address =
            updates.address.trim();

        const existingListing =
            await Listing.findOne({
                ownerId,
                address: updates.address,
                _id: { $ne: id }
            });

        if (existingListing) {
            throw new AppError(
                "Listing already exists for this address",
                409
            );
        }
    }

    Object.assign(listing, updates);

    try {
        await listing.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "Listing already exists for this address",
                409
            );
        }

        throw error;
    }

    const updatedListing =
        await Listing.findById(id)
            .populate("ownerId", "name image");

    res.status(200).json({
        message: "Listing updated successfully",
        listing: updatedListing
    });
};

export const deleteListingController = async (req, res) => {
    const { _id: ownerId } = req.user;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new AppError(
            "Invalid listing ID",
            400
        );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new AppError(
            "Listing not found",
            404
        );
    }

    if (
        listing.ownerId.toString() !==
        ownerId.toString()
    ) {
        throw new AppError(
            "You are not allowed to delete this listing",
            403
        );
    }

    await listing.deleteOne();

    res.status(200).json({
        message: "Listing deleted successfully"
    });
};