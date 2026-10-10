import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    roomType: {
        type: String,
        required: true,
        enum: ["single", "shared"]
    },

    rent: {
        type: Number,
        required: true,
        min: 0
    },

    deposit: {
        type: Number,
        required: true,
        min: 0
    },

    amenities: {
        type: [String],
        required: true,
        enum: [
            "wifi",
            "laundry",
            "parking",
            "furnished",
            "air conditioning",
            "heating"
        ]
    },

    photo: {
        type: [String],
        required: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    availableFrom: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: ["available", "booked"],
        default: "available"
    },

    address: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

listingSchema.index(
    { ownerId: 1, address: 1 },
    { unique: true }
);

const Listing = mongoose.model(
    "Listing",
    listingSchema
);

export default Listing;