const { Router } = require("express")
const { catchErrors } = require("../errors/catchErrors")
const { pick } = require("../lib/helpers")
const todoValidation = require("../middleware/validation/todoValidation")
const { createTodo, getTodos } = require("../models/todoServices")

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
  catchErrors(async (req, res) => {
    const todos = await getTodos(req.user.userId)
    res.status(200).send({ todos })
  })
)

module.exports = router