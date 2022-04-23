const path = require("path")
const { Router } = require("express")
const { catchErrors } = require("../errors/catchErrors")
const { getAttachment } = require("../models/attachmentServices")
const { NotFoundError } = require("../errors/CustomError")

const router = Router()

router.get(
  "/:attachmentId",
  catchErrors(async (req, res) => {
    let attachment = await getAttachment(
      req.params.attachmentId,
      req.user.userId
    )

    if (attachment) {
      return res
        .status(200)
        .sendFile(path.resolve(path.join(".", attachment.path)))
    } else {
      throw new NotFoundError("The attachment was not found.")
    }
  })
)

module.exports = router
