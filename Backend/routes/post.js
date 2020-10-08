const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const loginRequired = require("../middleware/loginRequired");

router.post("/post/create", loginRequired, (req, res) => {
    const { caption } = req.body;
    if (!caption) {
        return res.status(422).json({ error: "Please add caption" });
    }
    const post = new Post({
        caption,
        author: req.user,
    });
    post.save()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
