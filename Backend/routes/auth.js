const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET =
    "$2a$16$M8S4d1xj/p3won8BzNn6OOrV/H5p44v5s.fPIsr7X.iKYapnoRyLC";

const loginRequired = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: err });
        }
        const { _id } = payload;
        User.findById(_id).then((user) => {
            req.user = user;
        });
        next();
    });
};

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "All fields are required" });
    }
    User.findOne({ email: email })
        .then((userExists) => {
            if (userExists) {
                return res
                    .status(422)
                    .json({ error: "User already exists with that email" });
            }
            bcrypt.hash(password, 16).then((hashedPassword) => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    name,
                });
                user.save()
                    .then((user) => {
                        res.json({ message: "Account created successfully" });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "All fields are required" });
    }
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(422).json({ error: "Invalid Credentials!" });
        }
        bcrypt
            .compare(password, user.password)
            .then((match) => {
                if (match) {
                    //   res.json({ message: "Successfully Logged IN" });
                    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
                    res.send({ token });
                } else {
                    return res
                        .status(422)
                        .json({ error: "Invalid Credentials!" });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

module.exports = router;
