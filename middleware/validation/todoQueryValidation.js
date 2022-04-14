const { object, string } = require("yup")
const validationMiddleware = require("../validationMiddleware")

const querySchema = object({
  completed: string().oneOf(
    ["true", "false"],
    "The value for completed must be either true or false."
  ),
})

const todoQueryValidation = validationMiddleware([
  { name: "query", schema: querySchema },
])

module.exports = todoQueryValidation
