const express = require("express")
const userValidation = require("./middleware/validation/userValidation")
const User = require("./models/user")

const app = express()

app.use(express.json())

app.post("/api/1.0/users", userValidation, async (req, res) => {
  const { username, password } = req.body
  const user = new User({ username, password })
  await user.save()
  res.statusCode = 201
  res.json({ message: "User created" })
})

module.exports = app
