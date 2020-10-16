const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: ObjectId, ref: "User" }],
    lastMessage: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now,
    },
});

mongoose.model("Conversation", conversationSchema);
