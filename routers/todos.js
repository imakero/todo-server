const { Router } = require("express")
const { catchErrors } = require("../errors/catchErrors")
const { pick } = require("../lib/helpers")
const todoQueryValidation = require("../middleware/validation/todoQueryValidation")
const todoValidation = require("../middleware/validation/todoValidation")
const {
  createTodo,
  getTodos,
  setTodoCompleted,
} = require("../models/todoServices")

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

router.get(
  "/",
  todoQueryValidation,
  catchErrors(async (req, res) => {
    const filters = { author: req.user.userId }
    const { completed } = req.query
    if (completed !== undefined) {
      filters.completed = completed
    }
    const todos = await getTodos(filters)
    res.status(200).send({ todos })
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

module.exports = router
