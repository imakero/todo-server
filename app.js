const express = require("express")
const cors = require("cors")
const { databaseErrors } = require("./middleware/databaseErrors")
const { errorHandler } = require("./middleware/errorHandler")
const usersRouter = require("./routers/users")
const authRouter = require("./routers/auth")
const todosRouter = require("./routers/todos")
const attachmentsRouter = require("./routers/attachments")
const { authorizeUser } = require("./middleware/authorizeUser")
require("dotenv").config()

const app = express()

app.use(cors({ origin: "http://localhost:3001" }))
app.use(express.json())

app.use("/api/1.0/users", usersRouter)
app.use("/api/1.0/auth", authRouter)

app.use(authorizeUser)

app.use("/api/1.0/todos", todosRouter)
app.use("/api/1.0/attachments", attachmentsRouter)

app.use(databaseErrors)
app.use(errorHandler)

module.exports = app
