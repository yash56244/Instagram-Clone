const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const loginRequired = require("../middleware/loginRequired");

router.get("/posts/all", loginRequired, (req, res) => {
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
    const { caption, imageUrl } = req.body;
    if (!caption || !imageUrl) {
        return res.status(422).json({ error: "Please add all fields" });
    }
    const post = new Post({
        caption,
        author: req.user,
        photo: imageUrl,
    });
    post.save()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
        });
});

router.put("/like", loginRequired, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { likes: req.user._id },
        },
        {
            new: true,
        }
    ).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
});
router.put("/unlike", loginRequired, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $pull: { likes: req.user._id },
        },
        {
            new: true,
        }
    ).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
