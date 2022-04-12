const Todo = require("../models/todo")

const createTodo = (todo) => {
  const todoToSave = new Todo(todo)
  return todoToSave.save()
}

const getTodos = (userId) => {
  return Todo.find({ author: userId }).sort({ createdAt: -1 })
}

module.exports = { createTodo, getTodos }
