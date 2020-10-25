const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Conversation = mongoose.model("Conversation");
const Message = mongoose.model("Message");
const loginRequired = require("../middleware/loginRequired");

router.get("/inbox/:id", loginRequired, (req, res) => {
    const user1 = req.user._id;
    const user2 = req.params.id;
    Message.find({
        $or: [
            { $and: [{ from: user1 }, { to: user2 }] },
            { $and: [{ from: user2 }, { to: user1 }] },
        ],
    })
        .populate("from")
        .then((messages) => {
            res.json(messages);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/inbox/:id", loginRequired, async (req, res) => {
    const from = req.user._id;
    const to = req.params.id;
    await Conversation.findOneAndUpdate(
        {
            recipients: [from, to],
        },
        { recipients: [from, to], lastMessage: req.body.message },
        { new: true, upsert: true },
        (err, conversation) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            let message = new Message({
                conversation: conversation._id,
                from: from,
                to: to,
                body: req.body.message,
            });
            req.io.sockets.emit("messages", req.body.message);
            message
                .save()
                .then((result) => {
                    res.json(result);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    );
});

module.exports = router;
