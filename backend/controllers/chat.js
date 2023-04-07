const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("users", "-password").populate("latestMessage");
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name avatar email",
        });

        if (isChat.length > 0) {
            return res.status(200).json({ success: true, FullChat: isChat[0] });
        }
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
        console.log();
        res.status(201).json({ success: true, FullChat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.fetchChats = async (req, res) => {
    try {
        let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name avatar email",
        });
        res.status(200).json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteChat = async (req, res) => {
    try {
        console.log("OK");
        const { chatId } = req.body;
        const chat = await Chat.findById(chatId)
        if (!chat.isGroupChat) {
            const messages = await Message.deleteMany({ chat: chatId })
            await chat.remove()
            return res.status(200).json({ success: true, messages: "Chat Deleted" })
        }
        console.log(chat.groupAdmin);
        res.status(200).json({ success: true, message: "Group Deleted" })
        // if (req.user._id.toString() != chat.groupAdmin.)
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.createGroupChat = async (req, res) => {
    try {
        let users = JSON.parse(req.body.users);
        users.push(req.user);
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(201).json({ success: true, fullGroupChat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404).json({ success: false, message: "Group doesn't exists" });
        } else {
            res.status(200).json({ success: true, updatedChat });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await Chat.findById(chatId)
        if (req.user._id.toString() != chat.groupAdmin._id.toString()) {
            res.status(400).json({ success: false, message: "Not Admin" });
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");


        if (!removed) {
            res.status(404).json({ success: false, message: "Chat Not Found" });
        } else {
            res.status(200).json({ success: true, removed });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const chat = await Chat.findById(chatId)
        if (req.user._id.toString() != chat.groupAdmin._id.toString()) {
            res.status(400).json({ success: false, message: "Not Admin" });
        }

        const added = await Chat.findByIdAndUpdate(chatId,
            { $push: { users: userId } }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!added) {
            res.status(404).json({ success: false, message: "Chat Not Found" });
        } else {
            res.status(200).json({ success: true, added });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}