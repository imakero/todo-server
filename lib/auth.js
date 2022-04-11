const jwt = require("jsonwebtoken")

const generateToken = (user) => {
  const userId = user._id.toString()
  const token = jwt.sign(
    { userId, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24 h", subject: userId }
  )
  return token
}

module.exports = { generateToken }
