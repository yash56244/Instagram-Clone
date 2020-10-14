const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: ObjectId,
            ref: "User",
        },
    ],
    password: {
        type: String,
        required: true,
    },
});

mongoose.model("User", userSchema);
