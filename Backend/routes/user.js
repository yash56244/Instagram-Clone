const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const loginRequired = require("../middleware/loginRequired");

router.get("/user/:id", loginRequired, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ author: req.params.id })
                .populate("author", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    }
                    res.json({ user, posts });
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.put("/follow", loginRequired, (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id },
        },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $push: { following: req.body.followId },
                },
                { new: true }
            )
                .select("-password")
                .then((result) => res.json(result))
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        }
    );
});

router.put("/unfollow", loginRequired, (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { following: req.body.unfollowId },
                },
                { new: true }
            )
                .select("-password")
                .then((result) => res.json(result))
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        }
    );
});

module.exports = router;
