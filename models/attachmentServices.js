const { UniqueError } = require("../errors/CustomError")
const Attachment = require("./attachment")

const createAttachment = async (file, author) => {
  try {
    const { path, filename } = file
    const attachmentToSave = new Attachment({
      path,
      filename,
      author,
    })
    await attachmentToSave.save()
    return attachmentToSave
  } catch (error) {
    if (error.code === 11000) {
      throw new UniqueError(
        `This todo item already has an attachment with the same name, please rename the file and try again.`
      )
    } else {
      throw error
    }
  }
}

const getAttachment = async (attachmentId, userId) => {
  return await Attachment.findOne({ _id: attachmentId, author: userId })
}

module.exports = { getAttachment, createAttachment }
