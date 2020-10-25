const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema(
    {
        recipients: [{ type: ObjectId, ref: "User" }],
        lastMessage: {
            type: String,
        },
    },
    { timestamps: true }
);

mongoose.model("Conversation", conversationSchema);
