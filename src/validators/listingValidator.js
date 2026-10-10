import AppError from "../utils/AppError.js";

const allowedFields = [
    "title",
    "city",
    "roomType",
    "rent",
    "deposit",
    "amenities",
    "photo",
    "description",
    "availableFrom",
    "address"
];

const allowedAmenities = [
    "wifi",
    "laundry",
    "parking",
    "furnished",
    "air conditioning",
    "heating"
];

export const createListingValidator = (data) => {
    if (!data || typeof data !== "object") {
        throw new AppError("Request body is required", 400);
    }

    const fields = Object.keys(data);

    const invalidFields = fields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `Invalid fields: ${invalidFields.join(", ")}`,
            400
        );
    }

    if (
        typeof data.title !== "string" ||
        !data.title.trim()
    ) {
        throw new AppError("Title is required", 400);
    }

    if (
        typeof data.city !== "string" ||
        !data.city.trim()
    ) {
        throw new AppError("City is required", 400);
    }

    if (
        !data.roomType ||
        !["single", "shared"].includes(data.roomType)
    ) {
        throw new AppError("Invalid room type", 400);
    }

    if (
        data.rent === undefined ||
        typeof data.rent !== "number" ||
        data.rent < 0
    ) {
        throw new AppError("Valid rent is required", 400);
    }

    if (
        data.deposit === undefined ||
        typeof data.deposit !== "number" ||
        data.deposit < 0
    ) {
        throw new AppError("Valid deposit is required", 400);
    }

    if (
        !Array.isArray(data.amenities) ||
        data.amenities.length === 0
    ) {
        throw new AppError(
            "At least one amenity is required",
            400
        );
    }

    const invalidAmenities = data.amenities.filter(
        (amenity) => !allowedAmenities.includes(amenity)
    );

    if (invalidAmenities.length > 0) {
        throw new AppError(
            `Invalid amenities: ${invalidAmenities.join(", ")}`,
            400
        );
    }

    if (
        !Array.isArray(data.photo) ||
        data.photo.length === 0
    ) {
        throw new AppError(
            "At least one photo is required",
            400
        );
    }

    const invalidPhotos = data.photo.filter(
        (photo) =>
            typeof photo !== "string" ||
            !photo.trim()
    );

    if (invalidPhotos.length > 0) {
        throw new AppError("Invalid photo", 400);
    }

    if (
        typeof data.description !== "string" ||
        !data.description.trim()
    ) {
        throw new AppError(
            "Description is required",
            400
        );
    }

    if (!data.availableFrom) {
        throw new AppError(
            "Available from date is required",
            400
        );
    }

    if (
        isNaN(Date.parse(data.availableFrom))
    ) {
        throw new AppError(
            "Invalid available from date",
            400
        );
    }

    if (
        typeof data.address !== "string" ||
        !data.address.trim()
    ) {
        throw new AppError(
            "Address is required",
            400
        );
    }
};

export const updateListingValidator = (data) => {
    if (!data || typeof data !== "object") {
        throw new AppError(
            "Request body is required",
            400
        );
    }

    const fields = Object.keys(data);

    if (fields.length === 0) {
        throw new AppError(
            "At least one field is required",
            400
        );
    }

    const invalidFields = fields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `Invalid fields: ${invalidFields.join(", ")}`,
            400
        );
    }

    if (data.title !== undefined) {
        if (
            typeof data.title !== "string" ||
            !data.title.trim()
        ) {
            throw new AppError(
                "Invalid title",
                400
            );
        }
    }

    if (data.city !== undefined) {
        if (
            typeof data.city !== "string" ||
            !data.city.trim()
        ) {
            throw new AppError(
                "Invalid city",
                400
            );
        }
    }

    if (data.roomType !== undefined) {
        if (
            !["single", "shared"].includes(
                data.roomType
            )
        ) {
            throw new AppError(
                "Invalid room type",
                400
            );
        }
    }

    if (data.rent !== undefined) {
        if (
            typeof data.rent !== "number" ||
            data.rent < 0
        ) {
            throw new AppError(
                "Invalid rent",
                400
            );
        }
    }

    if (data.deposit !== undefined) {
        if (
            typeof data.deposit !== "number" ||
            data.deposit < 0
        ) {
            throw new AppError(
                "Invalid deposit",
                400
            );
        }
    }

    if (data.amenities !== undefined) {
        if (
            !Array.isArray(data.amenities) ||
            data.amenities.length === 0
        ) {
            throw new AppError(
                "At least one amenity is required",
                400
            );
        }

        const invalidAmenities = data.amenities.filter(
            (amenity) =>
                !allowedAmenities.includes(amenity)
        );

        if (invalidAmenities.length > 0) {
            throw new AppError(
                `Invalid amenities: ${invalidAmenities.join(", ")}`,
                400
            );
        }
    }

    if (data.photo !== undefined) {
        if (
            !Array.isArray(data.photo) ||
            data.photo.length === 0
        ) {
            throw new AppError(
                "At least one photo is required",
                400
            );
        }

        const invalidPhotos = data.photo.filter(
            (photo) =>
                typeof photo !== "string" ||
                !photo.trim()
        );

        if (invalidPhotos.length > 0) {
            throw new AppError(
                "Invalid photo",
                400
            );
        }
    }

    if (data.description !== undefined) {
        if (
            typeof data.description !== "string" ||
            !data.description.trim()
        ) {
            throw new AppError(
                "Invalid description",
                400
            );
        }
    }

    if (data.availableFrom !== undefined) {
        if (
            isNaN(Date.parse(data.availableFrom))
        ) {
            throw new AppError(
                "Invalid available from date",
                400
            );
        }
    }

    if (data.address !== undefined) {
        if (
            typeof data.address !== "string" ||
            !data.address.trim()
        ) {
            throw new AppError(
                "Invalid address",
                400
            );
        }
    }
};