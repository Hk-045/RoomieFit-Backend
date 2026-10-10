import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },

    age: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },

    currentCity: {
        type: String,
        required: true,
        trim: true
    },

    targetCity: {
        type: String,
        required: true,
        trim: true
    },

    sleepSchedule: {
        type: String,
        enum: ["early bird", "night owl", "flexible"],
        required: true
    },

    cleanliness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    foodPreference: {
        type: String,
        required: true,
        enum: [
            "vegetarian",
            "non-vegetarian",
            "vegan",
            "no preference"
        ],
        trim: true
    },

    smoking: {
        type: String,
        enum: ["yes", "no", "occasionally"],
        required: true,
        trim: true
    },

    drinking: {
        type: String,
        enum: ["yes", "no", "occasionally"],
        required: true,
        trim: true
    },

    socializing: {
        type: String,
        enum: ["rarely", "occasionally", "frequently"],
        required: true,
        trim: true
    },

    noiseTolerance: {
        type: String,
        enum: ["quiet", "moderate", "don't mind"],
        required: true,
        trim: true
    },

    budgetMin: {
        type: Number,
        required: true,
        min: 0
    },

    budgetMax: {
        type: Number,
        required: true,
        min: 0
    },

    moveInDate: {
        type: Date,
        required: true
    },

    bio: {
        type: String,
        trim: true,
        maxlength: 300
    },

    profileComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Profile = mongoose.model(
    "Profile",
    profileSchema
);

export default Profile;