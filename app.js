const express = require("express")
const { errorHandler } = require("./middleware/errorHandler")
const usersRouter = require("./routers/users")

const app = express()

app.use(express.json())

app.use("/api/1.0/users", usersRouter)

app.use(errorHandler)

module.exports = app
