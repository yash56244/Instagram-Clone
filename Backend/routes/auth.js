const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = mongoose.model("User");

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
        user
          .save()
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
          res.json({ message: "Successfully Logged IN" });
        } else {
          return res.status(422).json({ error: "Invalid Credentials!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
