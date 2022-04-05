const userSchema = require("../../models/userValidation")

const userValidation = async (req, res, next) => {
  try {
    const user = await userSchema.validate(req.body, { abortEarly: false })
  } catch (error) {
    res.statusCode = 400
    return res.json({ validationErrors: getErrorResponse(error) })
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

module.exports = userValidation
