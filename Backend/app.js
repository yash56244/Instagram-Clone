const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGOURI =
    "mongodb+srv://Yash:ui2Soj2wR3hJOOqe@cluster0.ijyx1.mongodb.net/test?retryWrites=true&w=majority";
const PORT = 5000;

require("./models/user");
require("./models/post");

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

app.listen(PORT, () => {
    console.log("Server is running on", PORT);
});
