const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config({ path: "./config.env" });
// console.log(process.env);
uuidv4();
// CONNECTING TO LOCAL DB
// const DB= process.env.DATABASE_LOCAL.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected sucessful!"));
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

todosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a todo must have a title"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "a todo must have a descriptin"],
    unique: true,
  },
});
const Todo = mongoose.model("Todo", todosSchema);

//middleware
app.use(express.json());
app.use(morgan("dev"));

//routes

app.get("/todos", async (req, res) => {
  const Todos = await Todo.find().populate("todos", "title description -_id");
  res.json(Todos);
});

app.get("/todos/:id", async (req, res) => {

  const getTodo = await Todo.findById(req.params.id);
  //another method
  // const getTodo = await Todo.findOne({_id:req.params.id});

  res.json(getTodo);
});

app.post("/todos", async(req, res) => {
  const newTodo = await Todo.create(req.body);
  res.json(newTodo);
});

app.put("/todos/:id", async (req, res) => {
  const Todo = await Todo.findById(req.params.id);
  Todo.title = req.body.title;
  Todo.description = req.body.description;
  await Todo.save();
  res.json(Todo);
});

app.delete("/todos/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port);
