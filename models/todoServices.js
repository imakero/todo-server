const Todo = require("../models/todo")

const createTodo = (todo) => {
  const todoToSave = new Todo(todo)
  return todoToSave.save()
}

module.exports = { createTodo }
