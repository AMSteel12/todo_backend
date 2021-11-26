var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todo");

const privateKey = process.env.JWT_PRIVATE_KEY;

router.use(function (req, res, next) {
  console.log(req.header("Authorization"));
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
      console.log(req.payload);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

router.get("/", async function (req, res, next) {
  const todoList = await Todo.find().where("authorID").equals(req.payload.id).exec();
  return res.status(200).json({todoList: todoList});
});

router.get("/:todoId", async function (req, res, next) {
  const todo = await Todo.findOne()
    .where("_id")
    .equals(req.params.todoId)
    .exec();

  return res.status(200).json(todo);
});



router.post("/", async function (req, res, next) {
  const todo = new Todo({
    title: req.body.title,
    author: red.body.author, 
    description: req.body.description,
    completeStatus: req.body.completeStatus,
    completedDate: req.body.completedDate,
    authorID: req.payload.id,
  });

  await todo
    .save()
    .then((savedTodo) => {
      return res.status(201).json({
        id: savedTodo._id,
        title: savedTodo.title,
        description: savedTodo.description,
        completeStatus: savedTodo.completeStatus,
        completedDate: savedTodo.completedDate,
        author: savedTodo.author,
        authorID: savedTodo.authorID,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.patch("/:id", async function (req, res) {

  var updateItem = req.body;
  var id = req.params.id;

  Todo.findByIdAndUpdate(id, updateItem)
    .then((toggledItem) => {
      toggledItem.save();
      return res.status(201).json(toggledItem);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.delete("/:id", async function (req, res) {

  var deleteItem = req.body;

  Todo.remove({_id: req.params.id}, (error) => {
    if (error) return res.status(500).json({error: error.message});
    else {
      return res.status(200).json(req.params.id);}
  });
});

module.exports = router;
