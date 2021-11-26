var express = require("express");
var router = express.Router();

const User = require("../models/User");
const Todo = require("../models/Todo");

router.get("/", async function (req, res, next) {
  const userList = await User.find().exec();
  return res.status(200).json({userList: userList});
});

router.get("/:userId", async function (req, res, next) {
  const todoList = await Todo.find()
    .where("authorID")
    .equals(req.params.userId)
    .exec();

    return res.status(200).json({ todoList: todoList });
  });

module.exports = router;