const mongoose =require('mongoose')
const express = require("express");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const app = express();

const TODOS = [
    {
      id:1,
      title: "todo1",
      description: "string1"
    },
    {
      id:2,
      title: "todo2",
      description: "string2"
    },
    {
      id:3,
      title: "todo3",
      description: "string3"
    },
    {
      id:4,
      title: "todo4",
      description: "string4"
    }
  ];


//middleware

app.use(express.json());

app.get("/TODOS", (req, res) => {
res.json(TODOS.map(el =>(   'title: ' +el.title + ' description: ' + el.description)));
});

app.get("/TODOS/:id", (req, res) => {
  res.json(TODOS.find((todo) => todo.id === req.params.id*1));
});


app.post("/TODOS", (req, res) => {
  //another method to create unique ids
  // req.id=uuidv4()
  // const newtodo= {"id": req.id,title: req.body.title ,"description":req.body.description};
  const newId=TODOS[TODOS.length-1].id+1;
  const newtodo= Object.assign({"id":newId} ,req.body);
  TODOS.push(newtodo);
  console.log(newId);
  res.json(TODOS);

}); 


app.delete("/TODOS/:id", (req, res) => {

  res.json(TODOS.filter(x=>x.id!=req.params.id*1));
});

app.put("/TODOS/:id", (req, res) => {

  const update =  TODOS.find((todo) => todo.id === req.params.id*1);
  update.title = req.body.title; 
  update.description = req.body.description;
  res.json(update);
});

app.listen(3000);
