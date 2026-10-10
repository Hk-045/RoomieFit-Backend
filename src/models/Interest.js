import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },

    compatibilityScore: {
        type: Number,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

interestSchema.index(
    { user1: 1, user2: 1 },
    {
        unique: true,
        partialFilterExpression: {
            listingId: { $exists: false }
        }
    }
);

interestSchema.index(
    { fromUserId: 1, listingId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            listingId: { $exists: true }
        }
    }
);

const Interest = mongoose.model(
    "Interest",
    interestSchema
);

export default Interest;