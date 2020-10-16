const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    conversation: {
        type: ObjectId,
        ref: "Conversation",
    },
    from: {
        type: ObjectId,
        ref: "User",
    },
    to: {
        type: ObjectId,
        ref: "User",
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
});

mongoose.model("Message", messageSchema);