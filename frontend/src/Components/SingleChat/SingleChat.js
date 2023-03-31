import io from "socket.io-client";
import "./SingleChat.css"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Button, Dialog, FormControl, Input, Typography } from '@mui/material';
import { accessChat } from '../../Actions/Chat';
import { fetchMessages } from '../../Actions/Message';
import { getSender } from '../../config/ChatLogics';
import Loader from '../Loader/Loader';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScrollableChat from '../ScrollableChat/ScrollableChat';
import { useAlert } from "react-alert"
const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ selectedChat, fetchAgain, setFetchAgain }) => {
    const alert = useAlert()
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [userDetailToggle, setUserDetailToggle] = useState(false)

    const { user, loading: userLoading } = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {

            setLoading(true);
            const { data } = await axios.get(`/api/v1/message/${selectedChat._id}`)
            setMessages(data.messages);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert.error(error)
        }
    };
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                setNewMessage("");
                const { data } = await axios.post("/api/v1/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data.message);
                setFetchAgain(!fetchAgain)
                setMessages([...messages, data.message]);
            } catch (error) {

            }
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);
    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            setMessages([...messages, newMessageRecieved]);
            setFetchAgain(!fetchAgain)
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            <Typography
                sx={{ fontSize: "30px", width: "100%", fontFamily: "Work sans", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                {messages &&
                    (!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <IconButton style={{ display: "flex", backgroundColor: "#edf2f7" }} onClick={() => setUserDetailToggle(!userDetailToggle)}>
                                <VisibilityIcon />
                            </IconButton>

                            <Dialog open={userDetailToggle} onClose={() => setUserDetailToggle(!userDetailToggle)}>
                                <div style={{ width: "38vw", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography sx={{ fontSize: "40px", fontFamily: "Work sans", fontWeight: "600" }}>{selectedChat.users[1].name}</Typography>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }} >
                                        <Avatar sx={{ width: "10vmax", height: "10vmax" }} src={selectedChat.users[1].avatar.url} alt={selectedChat.users[1].name} />
                                        <Typography fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
                                            Email: {selectedChat.users[1].email}
                                        </Typography>
                                    </div>
                                </div>
                            </Dialog>
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            {/* <IconButton style={{ display: "flex", backgroundColor: "#edf2f7" }}>
                                <VisibilityIcon />
                            </IconButton> */}
                        </>
                    ))}
            </Typography>
            {/* <Box
                // p={3}
                sx={{
                    border: "2px solid red",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    // justifyContent: "space-between",
                    backgroundColor: "#E8E8E8",
                    width: "100%",
                    height: "90%",
                    borderRadius: "5px",
                    overflowY: "hidden",
                    margin: "0 3vmax"
                }}
            > */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    backgroundColor: "#E8E8E8",
                    width: "100%",
                    height: "90%",
                    overflowY: "hidden"
                }}
            // p={3} borderRadius="lg"
            >
                {loading ? (
                    // <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                    <Loader />
                ) : (
                    <div className="messages" style={{ overflow: "auto" }}>
                        <ScrollableChat messages={messages} />
                    </div>
                )}
                <FormControl onKeyDown={sendMessage} id="first-name" sx={{ margin: "10px 10px" }}>
                    <Input sx={{ backgroundColor: "white", padding: "6px", borderRadius: "10px" }} placeholder="Enter your message.." value={newMessage} onChange={typingHandler} />
                </FormControl>
            </Box>
        </>
    )
}

export default SingleChat