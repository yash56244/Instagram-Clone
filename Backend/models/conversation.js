const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema(
    {
        conversationId: { type: String },
        recipients: [{ type: ObjectId, ref: "User" }],
        messages: [
            { from: { type: ObjectId, ref: "User" }, body: { type: String } },
        ],
    },
    { timestamps: true }
);

mongoose.model("Conversation", conversationSchema);
