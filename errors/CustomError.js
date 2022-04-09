class CustomError extends Error {
  constructor(name = "ServerError", message, status = 500, data = {}) {
    super(message)
    this.name = name
    this.status = status
    this.data = data
  }
}

class ValidationError extends CustomError {
  constructor(errorData) {
    super("ValidationError", "There were validation errors.", 400, errorData)
  }
}

module.exports = { CustomError, ValidationError }
