const { object, string } = require("yup")
const validationMiddleware = require("../validationMiddleware")

const bodySchema = object({
  text: string()
    .required("The tag text is required.")
    .min(1, "The tag's text must be at least 1 character long.")
    .max(20, "The tag's text must be less than 20 characters long."),
})

const tagValidation = validationMiddleware([
  { name: "body", schema: bodySchema },
])

module.exports = tagValidation
