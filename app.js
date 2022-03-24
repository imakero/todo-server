const express = require("express")

const app = express()

app.post("/api/1.0/users", (req, res) => {
  res.sendStatus(201)
})

module.exports = app
