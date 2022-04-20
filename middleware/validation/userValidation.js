const { object, string } = require("yup")
const validationMiddleware = require("../validationMiddleware")

const bodySchema = object({
  username: string()
    .required("Username is required.")
    .notOneOf([""], "Username is required.")
    .min(4, "Username must be between 4 and 32 characters long.")
    .max(32, "Username must be between 4 and 32 characters long."),
  password: string()
    .required("Password is required.")
    .notOneOf([""], "Password is required.")
    .min(8, "Password must be at least 8 characters long."),
})

const userValidation = validationMiddleware([
  { name: "body", schema: bodySchema },
])

module.exports = userValidation
