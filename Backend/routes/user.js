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

module.exports = router;
