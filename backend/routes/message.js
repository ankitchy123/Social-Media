const express = require("express")
const { sendMessage, allMessages } = require("../controllers/message")
const { isAuthenticated } = require("../middleware/auth")
const router = express.Router()

router.route('/message/').post(isAuthenticated, sendMessage)
router.route('/message/:chatId').get(isAuthenticated, allMessages)

module.exports = router