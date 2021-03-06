const { Router } = require("express")
const multer = require("multer")
const fs = require("fs")
const { catchErrors } = require("../errors/catchErrors")
const { pick } = require("../lib/helpers")
const todoQueryValidation = require("../middleware/validation/todoQueryValidation")
const todoValidation = require("../middleware/validation/todoValidation")
const {
  createTodo,
  getTodos,
  setTodoCompleted,
  updateTodo,
  addTodoAttachment,
  removeTodoAttachment,
  addTag,
  removeTag,
} = require("../models/todoServices")
const { createAttachment } = require("../models/attachmentServices")
const tagValidation = require("../middleware/validation/tagValidation")
const { getTagIds } = require("../models/tagServices")

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const path = `./uploads/${req.params.todoId}`
      fs.mkdirSync(path, { recursive: true })
      cb(null, path)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
})

const router = Router()

router.post(
  "/",
  todoValidation,
  catchErrors(async (req, res) => {
    const todoInput = pick(req.body, ["title"])
    const author = req.user.userId
    const todo = await createTodo({ ...todoInput, author })
    res.status(201).send({ message: "Todo created", todo: todo })
  })
)

router.put(
  "/:todoId",
  todoValidation,
  catchErrors(async (req, res) => {
    const fieldsToUpdate = pick(req.body, ["title", "content"])
    const { todoId } = req.params
    const updatedTodo = await updateTodo(todoId, fieldsToUpdate)
    res.status(200).send({ message: "Todo updated", todo: updatedTodo })
  })
)

router.get(
  "/",
  todoQueryValidation,
  catchErrors(async (req, res) => {
    const filters = { author: req.user.userId }
    const { completed, tags } = req.query
    if (completed !== undefined) {
      filters.completed = completed
    }
    if (tags !== undefined) {
      filters.tags = { $in: await getTagIds(tags) }
    }
    const todos = await getTodos(filters).populate(["attachments", "tags"])
    res.status(200).send({ todos })
  })
)

router.put(
  "/:todoId/attachments",
  upload.single("attachment"),
  catchErrors(async (req, res) => {
    let attachment = await createAttachment(req.file, req.user.userId)
    await addTodoAttachment(req.params.todoId, attachment._id)
    res
      .status(200)
      .send({ message: "Attachment created and added to todo.", attachment })
  })
)

router.delete(
  "/:todoId/attachments/:attachmentId",
  catchErrors(async (req, res) => {
    const { todoId, attachmentId } = req.params
    await removeTodoAttachment(todoId, attachmentId)
    res.sendStatus(204)
  })
)

router.post(
  "/:todoId/complete",
  catchErrors(async (req, res) => {
    const todo = await setTodoCompleted(req.params.todoId, true)
    res.status(200).send({ todo, message: "Todo completed" })
  })
)

router.delete(
  "/:todoId/complete",
  catchErrors(async (req, res) => {
    const todo = await setTodoCompleted(req.params.todoId, false)
    res.status(200).send({ message: "Todo reset", todo })
  })
)

router.put(
  "/:todoId/tags",
  tagValidation,
  catchErrors(async (req, res) => {
    const tag = await addTag(req.params.todoId, req.body.text)
    res.status(200).send({ message: "Tag added", tag })
  })
)

router.delete(
  "/:todoId/tags/:tagId",
  catchErrors(async (req, res) => {
    await removeTag(req.params.todoId, req.params.tagId)
    res.sendStatus(204)
  })
)

module.exports = router
