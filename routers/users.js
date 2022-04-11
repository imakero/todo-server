const { Router } = require("express")
const { catchErrors } = require("../errors/catchErrors")
const userValidation = require("../middleware/validation/userValidation")
const { createUser } = require("../models/userServices")

const router = Router()

router.post(
  "/",
  userValidation,
  catchErrors(async (req, res) => {
    const { username, password } = req.body
    await createUser(username, password)
    res.status(201).send({ message: "User created" })
  })
)

module.exports = router
