const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema(
    {
        conversationId: { type: String },
        recipients: [{ type: ObjectId, ref: "User" }],
        messages: [{ type: ObjectId, ref: "Message" }],
    },
    { timestamps: true }
);

mongoose.model("Conversation", conversationSchema);
