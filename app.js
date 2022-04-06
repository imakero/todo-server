const express = require("express")
const usersRouter = require("./routers/users")

const app = express()

app.use(express.json())

app.use("/api/1.0/users", usersRouter)

module.exports = app
