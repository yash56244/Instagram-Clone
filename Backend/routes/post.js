const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const loginRequired = require("../middleware/loginRequired");

router.get("/home", loginRequired, (req, res) => {
    Post.find({ author: { $in: req.user.following } })
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .sort("-createdAt")
        .then((posts) => {
            res.json({ posts });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/posts/me", loginRequired, (req, res) => {
    Post.find({ author: req.user._id })
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .sort("-createdAt")
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

router.delete("/post/:id/delete", loginRequired, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate("author", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err });
            } else if (post.author._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
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
    )
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .exec((err, result) => {
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
    )
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
});

router.put("/comment", loginRequired, (req, res) => {
    const comment = {
        text: req.body.text,
        author: req.user,
    };
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { comments: comment },
        },
        {
            new: true,
        }
    )
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
});

router.delete("/comment/:id/delete", loginRequired, (req, res) => {
    const comment = {
        _id: req.params.id,
    };
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: comment } },
        { new: true }
    )
        .populate("author", "-password")
        .populate("comments.author", "-password")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
});

module.exports = router;
