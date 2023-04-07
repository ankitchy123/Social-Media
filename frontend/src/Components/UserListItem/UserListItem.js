import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { accessChat } from '../../Actions/Chat';


const UserListItem = ({ user, handleFunction, admin = false }) => {
    // const { FullChat } = useSelector((state) => state.allChats)
    // const dispatch = useDispatch()
    // // const newChat = async () => {
    // //     setSelectedChat(FullChat._id)
    // // }
    // // useEffect(() => {
    // // }, [third])

    return (
        <Box
            sx={{
                cursor: "pointer",
                backgroundColor: "#E8E8E8",
                width: "92%",
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                // overflow: "auto",
                // wordWrap: "normal",
                "&:hover": {
                    backgroundColor: "#38B2AC",
                    color: "white"
                },
                '@media(max-width: 900px)': {
                    width: '90%'
                },
                '@media(max-width: 500px)': {
                    width: '85%'
                }
            }}
            onClick={handleFunction}
            px={3} py={2} mb={2}
        >
            <Avatar sx={{ width: "4vmax", height: "4vmax", marginRight: 2, cursor: "pointer" }} name={user.name} src={user.avatar.url} />
            <Box sx={{
                width: "90%",
                wordWrap: "break-word",
            }}>
                <Typography>{user.name} {admin ? <em style={{ color: "red" }}>Admin</em> : ""}</Typography>
                <Typography fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Typography>
            </Box>
        </Box >
    )
}

export default UserListItem