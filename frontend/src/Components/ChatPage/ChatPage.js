import React, { useEffect, useState } from 'react'
import "./Chatpage.css"
import { Button, Dialog, Typography } from '@mui/material';
import MyChats from '../MyChats/MyChats';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../Actions/User'
import Chatbox from '../ChatBox/ChatBox';
import { accessChat } from "../../Actions/Chat"
import UserListItem from '../UserListItem/UserListItem';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [searchToggle, setSearchToggle] = useState(false)
    const [name, setName] = useState("");

    const { users, loading } = useSelector((state) => state.allUsers);
    const { singleChat } = useSelector((state) => state.allChats)

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
    }, [singleChat])


    return (
        <div className='chat'>
            <div className="chatleft" style={{ padding: "0" }}>
                <MyChats setSearchToggle={setSearchToggle} searchToggle={searchToggle} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
            </div>
            <div className="chatright">
                {selectedChat ? <Chatbox selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> : <div className='nochat'>
                    <SendIcon style={{ fontSize: "7vmax", transform: "rotate(-24deg)" }} />
                    <Typography style={{ margin: "1vmax" }}>Your Messages</Typography>
                    <Button onClick={() => setSearchToggle(!searchToggle)}>Send Message</Button>

                </div>}
                <Dialog open={searchToggle} onClose={() => setSearchToggle(!searchToggle)}>
                    <div className="newChatDialog">
                        <form className="newChatsearchForm" onSubmit={submitHandler}>
                            {/* <form className="newChatsearchForm"> */}
                            <Typography variant="h3" style={{ padding: "2vmax" }}>
                                Search User
                            </Typography>
                            {/* <Input>
</Input> */}
                            <input
                                type="text"
                                placeholder="Name..."
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Button disabled={loading} type="submit">
                                Search
                            </Button>

                            <div className="searchResults">
                                {users && users.length > 0 ?
                                    users.map((user) => (
                                        // <div to={`/user/${user.userId}`} className='homeUser' key={user.userId}>
                                        // <div onClick={newChat(user._id)} className='homeUser' key={user._id}>
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => newChat(user._id)}
                                        // setSelectedChat={setSelectedChat}
                                        />
                                    )) :
                                    <Typography sx={{ width: "90%", margin: "auto" }} variant='h4'>No user with this name</Typography>}
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default ChatPage