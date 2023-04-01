import { Button, Dialog, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import "./MyChats.css"
import { borderRadius, Box, Stack } from '@mui/system';
import { createGroup, fetchAllChats } from "../../Actions/Chat"
import { getSender } from "../../config/ChatLogics"
import Loader from '../Loader/Loader';
import { getAllUsers } from '../../Actions/User';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import { useAlert } from "react-alert"

const MyChats = ({ setSearchToggle, searchToggle, selectedChat, setSelectedChat, setFetchAgain, fetchAgain }) => {
    const [createGroupToggle, setCreateGroupToggle] = useState(false)
    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const { allChats, loading } = useSelector((state) => state.allChats)
    const { user, loading: userLoading } = useSelector((state) => state.user)
    const { users, loading: allUsersLoading } = useSelector((state) => state.allUsers)
    const alert = useAlert()
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (!groupChatName || !selectedUsers) {
            alert.info("Please fill all the feilds")
            return;
        }
        let userSet = JSON.stringify(selectedUsers.map((u) => u._id))
        dispatch(createGroup(groupChatName, userSet))
        setCreateGroupToggle(!createGroupToggle)
        setFetchAgain(!fetchAgain)
    }
    const handleSearch = (query) => {
        if (!query) {
            alert.info("Please enter a name")
            return;
        }
        dispatch(getAllUsers(query))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            alert.info("User already added")
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    useEffect(() => {
        dispatch(fetchAllChats())
    }, [dispatch, fetchAgain, selectedChat])
    return (
        loading ? <Loader /> : <div className='container'>
            <div className='newGroupContainer'>
                <Button onClick={() => setCreateGroupToggle(!createGroupToggle)}>New Group Chat<AddIcon /></Button>
                <Button onClick={() => setSearchToggle(!searchToggle)}>New Chat<AddIcon /></Button>
            </div>
            <Stack>
                <div className='chatContainer'>
                    {allChats && allChats.length > 0 ?
                        allChats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                sx={{
                                    backgroundColor: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                                    color: selectedChat === chat ? "white" : "black",
                                    cursor: "pointer",
                                    margin: "1vmax",
                                    padding: "0.7vmax",
                                    borderRadius: "10px"
                                }}
                                key={chat._id}
                            >
                                <Typography>
                                    {!chat.isGroupChat
                                        ? getSender(user, chat.users)
                                        : chat.chatName}
                                </Typography>
                                {chat.latestMessage && (
                                    <Typography sx={{ fontSize: "13px" }} fontSize="xs">
                                        <b>{chat.latestMessage.sender._id === user._id ? "You" : chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Typography>
                                )}
                            </Box>
                        ))
                        : "Search User to Start Chatting"}
                </div>
            </Stack >


            <Dialog open={createGroupToggle} onClose={() => setCreateGroupToggle(!createGroupToggle)}>
                <div className="createGroupDialog">
                    <Typography variant="h3" style={{ padding: "1vmax" }}>
                        Create Group
                    </Typography>
                    <form className="createGroupForm">
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
                    <Box w="100%" d="flex" flexWrap="wrap">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </Box>
                    <div className="searchGroupUser">
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
        </div >
    )
}

export default MyChats