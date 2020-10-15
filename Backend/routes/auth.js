const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = mongoose.model("User");
const JWT_SECRET =
    "$2a$16$M8S4d1xj/p3won8BzNn6OOrV/H5p44v5s.fPIsr7X.iKYapnoRyLC";

router.post("/register", (req, res) => {
    const { name, email, password, photoUrl } = req.body;
    if (!name || !email || !password || !photoUrl) {
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
                    photo: photoUrl,
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
                    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
                    res.send({ token, user });
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

router.put("/profile/edit", (req, res)=>{
    const {name , email, bio, photoUrl} = req.body;
})

module.exports = router;
