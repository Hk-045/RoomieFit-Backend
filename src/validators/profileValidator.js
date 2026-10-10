import AppError from "../utils/AppError.js";

const allowedFields = [
    "age",
    "gender",
    "currentCity",
    "targetCity",
    "sleepSchedule",
    "cleanliness",
    "foodPreference",
    "smoking",
    "drinking",
    "socializing",
    "noiseTolerance",
    "budgetMin",
    "budgetMax",
    "moveInDate",
    "bio"
];

export const createProfileValidator = (data) => {
    if (!data || typeof data !== "object") {
        throw new AppError("Request body is required", 400);
    }

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
        typeof data.age !== "number" ||
        data.age <= 0
    ) {
        throw new AppError("Age must be a valid number", 400);
    }

    if (!data.gender) {
        throw new AppError("Gender is required", 400);
    }

    if (!["male", "female", "other"].includes(data.gender)) {
        throw new AppError("Invalid gender", 400);
    }

    if (
        typeof data.currentCity !== "string" ||
        !data.currentCity.trim()
    ) {
        throw new AppError("Current city is required", 400);
    }

    if (
        typeof data.targetCity !== "string" ||
        !data.targetCity.trim()
    ) {
        throw new AppError("Target city is required", 400);
    }

    if (!data.sleepSchedule) {
        throw new AppError("Sleep schedule is required", 400);
    }

    if (
        !["early bird", "night owl", "flexible"].includes(
            data.sleepSchedule
        )
    ) {
        throw new AppError("Invalid sleep schedule", 400);
    }

    if (
        typeof data.cleanliness !== "number" ||
        data.cleanliness < 1 ||
        data.cleanliness > 5
    ) {
        throw new AppError(
            "Cleanliness must be between 1 and 5",
            400
        );
    }

    if (!data.foodPreference) {
        throw new AppError("Food preference is required", 400);
    }

    if (
        ![
            "vegetarian",
            "non-vegetarian",
            "vegan",
            "no preference"
        ].includes(data.foodPreference)
    ) {
        throw new AppError("Invalid food preference", 400);
    }

    if (!data.smoking) {
        throw new AppError("Smoking preference is required", 400);
    }

    if (!["yes", "no", "occasionally"].includes(data.smoking)) {
        throw new AppError("Invalid smoking preference", 400);
    }

    if (!data.drinking) {
        throw new AppError("Drinking preference is required", 400);
    }

    if (!["yes", "no", "occasionally"].includes(data.drinking)) {
        throw new AppError("Invalid drinking preference", 400);
    }

    if (!data.socializing) {
        throw new AppError(
            "Socializing preference is required",
            400
        );
    }

    if (
        !["rarely", "occasionally", "frequently"].includes(
            data.socializing
        )
    ) {
        throw new AppError(
            "Invalid socializing preference",
            400
        );
    }

    if (!data.noiseTolerance) {
        throw new AppError(
            "Noise tolerance is required",
            400
        );
    }

    if (
        !["quiet", "moderate", "don't mind"].includes(
            data.noiseTolerance
        )
    ) {
        throw new AppError(
            "Invalid noise tolerance",
            400
        );
    }

    if (
        data.budgetMin === undefined ||
        data.budgetMax === undefined
    ) {
        throw new AppError(
            "Budget range is required",
            400
        );
    }

    if (
        typeof data.budgetMin !== "number" ||
        typeof data.budgetMax !== "number" ||
        data.budgetMin < 0 ||
        data.budgetMax < 0
    ) {
        throw new AppError(
            "Budget must be valid numbers",
            400
        );
    }

    if (data.budgetMin > data.budgetMax) {
        throw new AppError(
            "Minimum budget cannot be greater than maximum budget",
            400
        );
    }

    if (!data.moveInDate) {
        throw new AppError(
            "Move-in date is required",
            400
        );
    }

    if (
        isNaN(new Date(data.moveInDate).getTime())
    ) {
        throw new AppError(
            "Invalid move-in date",
            400
        );
    }

    if (data.bio !== undefined) {
        if (
            typeof data.bio !== "string" ||
            data.bio.length > 300
        ) {
            throw new AppError(
                "Bio cannot exceed 300 characters",
                400
            );
        }
    }
};

export const updateProfileValidator = (data) => {
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
        (item) => !allowedFields.includes(item)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `Invalid fields: ${invalidFields.join(", ")}`,
            400
        );
    }

    if (data.age !== undefined) {
        if (
            typeof data.age !== "number" ||
            data.age <= 0
        ) {
            throw new AppError(
                "Age must be a valid number",
                400
            );
        }
    }

    if (data.gender !== undefined) {
        if (
            !["male", "female", "other"].includes(
                data.gender
            )
        ) {
            throw new AppError(
                "Invalid gender",
                400
            );
        }
    }

    if (data.currentCity !== undefined) {
        if (
            typeof data.currentCity !== "string" ||
            !data.currentCity.trim()
        ) {
            throw new AppError(
                "Current city is invalid",
                400
            );
        }
    }

    if (data.targetCity !== undefined) {
        if (
            typeof data.targetCity !== "string" ||
            !data.targetCity.trim()
        ) {
            throw new AppError(
                "Target city is invalid",
                400
            );
        }
    }

    if (data.sleepSchedule !== undefined) {
        if (
            ![
                "early bird",
                "night owl",
                "flexible"
            ].includes(data.sleepSchedule)
        ) {
            throw new AppError(
                "Invalid sleep schedule",
                400
            );
        }
    }

    if (data.cleanliness !== undefined) {
        if (
            typeof data.cleanliness !== "number" ||
            data.cleanliness < 1 ||
            data.cleanliness > 5
        ) {
            throw new AppError(
                "Cleanliness must be between 1 and 5",
                400
            );
        }
    }

    if (data.foodPreference !== undefined) {
        if (
            ![
                "vegetarian",
                "non-vegetarian",
                "vegan",
                "no preference"
            ].includes(data.foodPreference)
        ) {
            throw new AppError(
                "Invalid food preference",
                400
            );
        }
    }

    if (data.smoking !== undefined) {
        if (
            ![
                "yes",
                "no",
                "occasionally"
            ].includes(data.smoking)
        ) {
            throw new AppError(
                "Invalid smoking preference",
                400
            );
        }
    }

    if (data.drinking !== undefined) {
        if (
            ![
                "yes",
                "no",
                "occasionally"
            ].includes(data.drinking)
        ) {
            throw new AppError(
                "Invalid drinking preference",
                400
            );
        }
    }

    if (data.socializing !== undefined) {
        if (
            ![
                "rarely",
                "occasionally",
                "frequently"
            ].includes(data.socializing)
        ) {
            throw new AppError(
                "Invalid socializing preference",
                400
            );
        }
    }

    if (data.noiseTolerance !== undefined) {
        if (
            ![
                "quiet",
                "moderate",
                "don't mind"
            ].includes(data.noiseTolerance)
        ) {
            throw new AppError(
                "Invalid noise tolerance",
                400
            );
        }
    }

    if (data.budgetMin !== undefined) {
        if (
            typeof data.budgetMin !== "number" ||
            data.budgetMin < 0
        ) {
            throw new AppError(
                "Invalid minimum budget",
                400
            );
        }
    }

    if (data.budgetMax !== undefined) {
        if (
            typeof data.budgetMax !== "number" ||
            data.budgetMax < 0
        ) {
            throw new AppError(
                "Invalid maximum budget",
                400
            );
        }
    }

    if (
        data.budgetMin !== undefined &&
        data.budgetMax !== undefined &&
        data.budgetMin > data.budgetMax
    ) {
        throw new AppError(
            "Minimum budget cannot be greater than maximum budget",
            400
        );
    }

    if (data.moveInDate !== undefined) {
        if (
            isNaN(new Date(data.moveInDate).getTime())
        ) {
            throw new AppError(
                "Invalid move-in date",
                400
            );
        }
    }

    if (data.bio !== undefined) {
        if (
            typeof data.bio !== "string" ||
            data.bio.length > 300
        ) {
            throw new AppError(
                "Bio cannot exceed 300 characters",
                400
            );
        }
    }
};