const jwt = require("jsonwebtoken")
const {
  InvalidTokenError,
  UnauthorizedError,
} = require("../errors/CustomError")

const authorizeUser = (req, res, next) => {
  const authHeader = req.header("Authorization")
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      req.token = token
      return next()
    } catch (error) {
      return next(new InvalidTokenError())
    }
  }
  return next(new UnauthorizedError())
}

module.exports = { authorizeUser }
