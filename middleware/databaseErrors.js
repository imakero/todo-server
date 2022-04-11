const { UniqueError } = require("../errors/CustomError")

const databaseErrors = (err, _req, _res, next) => {
  if (err.name === "MongoServerError") {
    if (err.code === 11000) {
      const [key, value] = Object.entries(err.keyValue)[0]
      return next(
        new UniqueError(`The ${key} '${value}' is already in use.`, key, value)
      )
    }
  }
  next(err)
}

module.exports = { databaseErrors }
