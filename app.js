const express = require("express")
const { databaseErrors } = require("./middleware/databaseErrors")
const { errorHandler } = require("./middleware/errorHandler")
const usersRouter = require("./routers/users")

const app = express()

app.use(express.json())

app.use("/api/1.0/users", usersRouter)

app.use(databaseErrors)
app.use(errorHandler)

module.exports = app
