const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors')
const path = require("path")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

// MIDDLEWARES
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ROUTES
const post = require("./routes/post");
const user = require("./routes/user");
const message = require("./routes/message");
const chat = require("./routes/chat");

// Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);
app.use("/api/v1", message);
app.use("/api/v1", chat);

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
})
module.exports = app;