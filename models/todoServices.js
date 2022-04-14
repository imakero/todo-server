const { NotFoundError } = require("../errors/CustomError")
const Todo = require("../models/todo")

const createTodo = (todo) => {
  const todoToSave = new Todo(todo)
  return todoToSave.save()
}

const getTodos = (userId) => {
  return Todo.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author")
}

const setTodoCompleted = async (todoId, completed) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { completed },
      { returnDocument: "after" }
    )
    return todo
  } catch (error) {
    throw new NotFoundError(`The todo item with id '${todoId}' does not exist`)
  }
}

module.exports = { createTodo, getTodos, setTodoCompleted }
