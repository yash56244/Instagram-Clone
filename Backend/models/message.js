const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
    {
        from: {
            type: ObjectId,
            ref: "User",
        },
        body: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

mongoose.model("Message", messageSchema);
