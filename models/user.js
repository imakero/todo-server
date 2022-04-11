const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { IncorrectCredentialsError } = require("../errors/CustomError")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
})

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username }).select("+password")
  if (user && (await bcrypt.compare(password, user.password))) {
    return user
  } else {
    throw new IncorrectCredentialsError()
  }
}

const User = mongoose.model("User", userSchema)

module.exports = User
