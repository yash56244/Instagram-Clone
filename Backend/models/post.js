const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: ObjectId,
            ref: "User",
        },
    ],
    author: {
        type: ObjectId,
        ref: "User",
    },
});

mongoose.model("Post", postSchema);
