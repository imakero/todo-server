const { Router } = require("express")
const { catchErrors } = require("../errors/catchErrors")
const { generateToken } = require("../lib/auth")
const { pick } = require("../lib/helpers")
const User = require("../models/user")

const router = Router()

router.post(
  "/login",
  catchErrors(async (req, res) => {
    const { username, password } = req.body
    const user = await User.login(username, password)
    const userWithoutPassword = pick(user.toObject(), ["_id", "username"])
    res.send({ ...userWithoutPassword, token: generateToken(user) })
  })
)

module.exports = router
