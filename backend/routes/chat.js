const express = require("express")
const { fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, accessChat, deleteChat } = require("../controllers/chat")
const { isAuthenticated } = require("../middleware/auth")
const router = express.Router()

router.route('/chat/').post(isAuthenticated, accessChat).get(isAuthenticated, fetchChats)
router.route('/chat/delete').delete(isAuthenticated, deleteChat)
router.route('/chat/group').post(isAuthenticated, createGroupChat)
router.route('/chat/rename').put(isAuthenticated, renameGroup)
router.route('/chat/groupremove').put(isAuthenticated, removeFromGroup)
router.route('/chat/groupadd').put(isAuthenticated, addToGroup)

module.exports = router