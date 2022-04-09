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

class UniqueError extends CustomError {
  constructor(message, key, value) {
    super("UniqueError", message, 409, { key, value })
  }
}

module.exports = { CustomError, ValidationError, UniqueError }
