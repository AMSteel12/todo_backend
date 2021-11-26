var express = require("express");
var path = require("path");
var logger = require("morgan");

require("dotenv").config();
require("./models/setupMongo")();

var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var todosRouter = require("./routes/todos");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/todos", todosRouter);

module.exports = app;
