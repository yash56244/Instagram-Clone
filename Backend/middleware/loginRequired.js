const jwt = require("jsonwebtoken");
const JWT_SECRET =
    "$2a$16$M8S4d1xj/p3won8BzNn6OOrV/H5p44v5s.fPIsr7X.iKYapnoRyLC";
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
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
            next();
        });
    });
};
