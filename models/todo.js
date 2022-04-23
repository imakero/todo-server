const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    completed: { type: Boolean, required: true, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
  },
  { timestamps: true }
)

const Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo
