const mongoose = require("mongoose")

const attachmentSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, unique: true, lowercase: true },
    filename: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

const Attachment = mongoose.model("Attachment", attachmentSchema)

module.exports = Attachment
