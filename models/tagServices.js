const { default: mongoose } = require("mongoose")
const Tag = require("./tag")

const getTagIds = async (tagTexts) => {
  const tags = await Tag.find({ text: tagTexts })
  return tags.map((tag) => mongoose.Types.ObjectId(tag._id))
}

module.exports = { getTagIds }
