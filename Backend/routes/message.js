const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Conversation = mongoose.model("Conversation");
const loginRequired = require("../middleware/loginRequired");

router.get("/conversation/:id", loginRequired, (req, res) => {
    Conversation.find({ conversationId: req.params.id })
        .populate("messages")
        .exec((err, conversation) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            res.json(conversation);
        });
});

router.post("/inbox", loginRequired, async (req, res) => {
    const message = { from: req.user, body: req.body.message };
    await Conversation.findOneAndUpdate(
        { conversationId: req.body.conversationId },
        { $push: { messages: message }, recipients: req.body.recipients },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec((err, conversation) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        req.io.sockets.emit("message", req.body.message);
        res.json(conversation);
    });
});

module.exports = router;
