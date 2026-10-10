import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    image: {
        type: String,
        trim: true
    },

    role: {
        type: String,
        required: true,
        enum: ["seeker", "host"]
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(
        this.password,
        10
    );
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(
        password,
        this.password
    );
};

const User = mongoose.model(
    "User",
    userSchema
);

export default User;