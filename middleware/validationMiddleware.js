const { ValidationError } = require("../errors/CustomError")

const validationMiddleware = (fieldsToValidate) => async (req, res, next) => {
  try {
    await Promise.all(
      fieldsToValidate.map((field) =>
        field.schema.validate(req[field.name], { abortEarly: false })
      )
    )
  } catch (error) {
    next(new ValidationError({ validationErrors: getErrorResponse(error) }))
  }
  next()
}

const getErrorResponse = (errors) => {
  if (errors.inner && errors.inner.length > 0) {
    return errors.inner.reduce(
      (validationErrors, error) =>
        Object.assign(validationErrors, getErrorResponse(error)),
      {}
    )
  } else {
    return { [errors.path]: errors.message }
  }
}

module.exports = validationMiddleware
