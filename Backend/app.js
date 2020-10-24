const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
// const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const MONGOURI =
    "mongodb+srv://Yash:ui2Soj2wR3hJOOqe@cluster0.ijyx1.mongodb.net/test?retryWrites=true&w=majority";
const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log("Server is running on", PORT);
});

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
// app.use(cors());

const io = socket(server);

app.use((req, res, next) => {
    req.io = io;
    next();
});

require("./models/user");
require("./models/post");
require("./models/conversation");
require("./models/message");

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
    console.log("ERROR : ", err);
});

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/message"));
