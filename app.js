const express = require("express")
const userValidation = require("./middleware/validation/userValidation")
const { createUser } = require("./models/userServices")

const app = express()

app.use(express.json())

app.post("/api/1.0/users", userValidation, async (req, res) => {
  const { username, password } = req.body
  await createUser(username, password)
  res.statusCode = 201
  res.json({ message: "User created" })
})

module.exports = app
