const mongoose = require("mongoose")
const fs = require("fs").promises
const path = require("path")
const { NotFoundError } = require("../errors/CustomError")
const Todo = require("../models/todo")
const Attachment = require("./attachment")

const createTodo = (todo) => {
  const todoToSave = new Todo(todo)
  return todoToSave.save()
}

const getTodos = (filters) => {
  return Todo.find(filters).sort({ createdAt: -1 }).populate("author")
}

const getTodo = (todoId) => {
  return Todo.findById(todoId)
}

const updateTodo = async (todoId, fieldsToUpdate) => {
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoId },
    { ...fieldsToUpdate },
    { returnDocument: "after" }
  )
  if (!updateTodo) {
    throw new NotFoundError(`The todo item with id '${todoId}' does not exist`)
  } else {
    return updatedTodo
  }
}

const addTodoAttachment = async (todoId, attachmentId) => {
  const res = await Todo.updateOne(
    { _id: todoId },
    {
      $addToSet: {
        attachments: attachmentId,
      },
    }
  )
  if (!res.modifiedCount) {
    throw new NotFoundError(`The todo item with id '${todoId}' was not found`)
  }
}

const removeTodoAttachment = async (todoId, attachmentId) => {
  const attachment = await Attachment.findOneAndDelete({ _id: attachmentId })
  await Todo.updateOne(
    { _id: todoId },
    { $pull: { attachments: mongoose.Types.ObjectId(attachmentId) } }
  )
  await fs.unlink(path.join(".", attachment.path))
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

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  setTodoCompleted,
  addTodoAttachment,
  removeTodoAttachment,
}
