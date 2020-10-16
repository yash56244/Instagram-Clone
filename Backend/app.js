const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const app = express();
const MONGOURI =
    "mongodb+srv://Yash:ui2Soj2wR3hJOOqe@cluster0.ijyx1.mongodb.net/test?retryWrites=true&w=majority";
const PORT = 5000;

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

const server = app.listen(PORT, () => {
    console.log("Server is running on", PORT);
});

const io = socket(server);
io.on("connection", (socket) => {
    console.log("Made Socket connection ", socket.id);
});
