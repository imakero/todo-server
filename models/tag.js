const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true, lowercase: true },
})

const Tag = mongoose.model("Tag", tagSchema)

module.exports = Tag