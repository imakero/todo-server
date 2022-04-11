const catchErrors = (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next)
  } catch (error) {
    next(error)
  }
}

module.exports = { catchErrors }
