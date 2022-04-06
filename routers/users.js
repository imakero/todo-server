const { Router } = require("express")
const userValidation = require("../middleware/validation/userValidation")
const { createUser } = require("../models/userServices")

const router = Router()

router.post("/", userValidation, async (req, res) => {
  const { username, password } = req.body
  await createUser(username, password)
  res.statusCode = 201
  res.json({ message: "User created" })
})

module.exports = router
