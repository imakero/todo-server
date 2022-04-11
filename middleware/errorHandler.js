const { CustomError } = require("../errors/CustomError")
const { pick } = require("../lib/helpers")

const errorHandler = (err, _req, res, _next) => {
  //console.error(err)

  const clientError =
    err instanceof CustomError
      ? pick(err, ["name", "message", "status", "data"])
      : {
          name: "ServerError",
          message:
            "Something went wrong. If the problem persists contact support.",
          status: 500,
          data: {},
        }

  res.status(clientError.status).send({ error: clientError })
}

module.exports = { errorHandler }
