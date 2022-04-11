const User = require("../models/user")

const createUser = (username, password) => {
  const user = new User({ username, password })
  return user.save()
}

module.exports = { createUser }
