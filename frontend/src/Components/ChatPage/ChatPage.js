import React, { useEffect, useState } from 'react'
import "./Chatpage.css"
import { Box, Button, Dialog, Typography } from '@mui/material';
import MyChats from '../MyChats/MyChats';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../Actions/User'
import Chatbox from '../ChatBox/ChatBox';
import { accessChat, createGroup } from "../../Actions/Chat"
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import { useAlert } from "react-alert"

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [searchToggle, setSearchToggle] = useState(false)
    const [createGroupToggle, setCreateGroupToggle] = useState(false)
    const [name, setName] = useState("");

    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const { users, loading } = useSelector((state) => state.allUsers);
    const { singleChat, group, message } = useSelector((state) => state.allChats)
    const alert = useAlert()

    const handleSubmit = () => {
        if (!groupChatName || !selectedUsers) {
            alert.info("Please fill all the feilds")
            return;
        }
        if (selectedUsers.length < 2) {
            alert.info("More than 2 users are required to form a group chat")
            return
        }

        let userSet = JSON.stringify(selectedUsers.map((u) => u._id))
        dispatch(createGroup(groupChatName, userSet))
        setCreateGroupToggle(!createGroupToggle)
        setFetchAgain(!fetchAgain)
        setSelectedUsers([])
    }
    const handleSearch = (query) => {
        if (!query) {
            alert.info("Please enter a name")
            return;
        }
        dispatch(getAllUsers(query))
    }
    const handleGroup = (userToAdd) => {
        for (let i = 0; i < selectedUsers.length; i++) {
            if (userToAdd._id.toString() === selectedUsers[i]._id.toString()) {
                alert.info("User already added")
                return;
            }

        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const dispatch = useDispatch();
    const newChat = async (id) => {
        await dispatch(accessChat(id))
        setSearchToggle(!searchToggle)
        // setSelectedChat(singleChat._id)
    }
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllUsers(name));
    };

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch, searchToggle])


    useEffect(() => {
        if (singleChat) {
            setSelectedChat(singleChat)
        }
        if (group) {
            setSelectedChat(group)
        }
    }, [singleChat, group])
    // useEffect(() => {
    //     if (message) {
    //         alert.info("Please fill all the feilds")
    //     }
    // }, [message, alert])


    return (
        <div className='chat'>
            <div className="chatleft" style={{ padding: "0", overflowX: "hidden" }}>
                <MyChats setSearchToggle={setSearchToggle} searchToggle={searchToggle} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} createGroupToggle={createGroupToggle} setCreateGroupToggle={setCreateGroupToggle} />
            </div>
            <div className="chatright">
                {selectedChat ? <Chatbox selectedChat={selectedChat} setSelectedChat={setSelectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> : <div className='nochat'>
                    <SendIcon style={{ fontSize: "7vmax", transform: "rotate(-24deg)" }} />
                    <Typography style={{ margin: "1vmax" }}>Your Messages</Typography>
                    <Button onClick={() => setSearchToggle(!searchToggle)}>Send Message</Button>

                </div>}
                <Dialog sx={{ zIndex: 1000 }} open={searchToggle} onClose={() => setSearchToggle(!searchToggle)}>
                    <div className="newChatDialog">
                        <form className="newChatsearchForm" onSubmit={submitHandler}>
                            <Typography variant="h3" style={{ padding: "2vmax" }}>
                                Search User
                            </Typography>
                            <input
                                type="text"
                                placeholder="Name..."
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Button disabled={loading} type="submit">Search</Button>

                            <div className="searchResults">
                                {users && users.length > 0 ?
                                    users.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => newChat(user._id)}
                                        />
                                    )) :
                                    <Typography sx={{ width: "90%", margin: "auto" }} variant='h4'>No user with this name</Typography>}
                            </div>
                        </form>
                    </div>
                </Dialog>

                <Dialog sx={{ zIndex: 1 }} open={createGroupToggle} onClose={() => setCreateGroupToggle(!createGroupToggle)}>
                    <div className="newChatDialog">
                        <Typography variant="h3" style={{ padding: "1vmax" }}>Create Group</Typography>
                        <form className="newChatsearchForm">
                            <input
                                type="text"
                                placeholder="Group Name..."
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Add Users eg: John, Piyush, Jane"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </form>
                        <Box sx={{ width: "90%" }} w="100%" d="flex" flexWrap="wrap" >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        <div className="searchResults">
                            {users &&
                                users?.slice(0, 4).map((res) => (
                                    <UserListItem
                                        key={res._id}
                                        user={res}
                                        handleFunction={() => handleGroup(res)}
                                    />
                                ))}
                        </div>
                        <Button style={{ marginBottom: "10px" }} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </div>
                </Dialog >
            </div>
        </div>
    )
}

export default ChatPage