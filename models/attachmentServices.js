const { UniqueError } = require("../errors/CustomError")
const Attachment = require("./attachment")

const createAttachment = async (file) => {
  try {
    const { path, filename } = file
    const attachmentToSave = new Attachment({ path, filename })
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

module.exports = { createAttachment }
