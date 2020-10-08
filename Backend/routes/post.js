const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const loginRequired = require("../middleware/loginRequired");

router.get("/posts/all", (req, res) => {
    Post.find()
        .populate("author")
        .then((posts) => {
            res.json({ posts });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/posts/me", loginRequired, (req, res) => {
    Post.find({ author: req.user._id })
        .populate("author")
        .then((posts) => {
            res.json({ posts });
        })
        .catch((error) => {
            console.log(error);
        });
});

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
        .catch((error) => {
            console.log(error);
        });
});

module.exports = router;
