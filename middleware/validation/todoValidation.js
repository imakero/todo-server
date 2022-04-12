const { object, string } = require("yup")
const validationMiddleware = require("../validationMiddleware")

const bodySchema = object({
  title: string()
    .required("The todo's title is required.")
    .min(1, "The todo's title must be at least 1 character long.")
    .max(1000, "The todo's title must be less than 1000 characters long"),
})

const todoValidation = validationMiddleware([
  { name: "body", schema: bodySchema },
])

module.exports = todoValidation
