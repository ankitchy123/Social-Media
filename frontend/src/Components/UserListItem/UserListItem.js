import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { accessChat } from '../../Actions/Chat';


const UserListItem = ({ user, handleFunction }) => {
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
                width: "89%",
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                "&:hover": {
                    backgroundColor: "#38B2AC",
                    color: "white"
                },
            }}
            onClick={handleFunction}
            px={3} py={2} mb={2}
        >
            <Avatar sx={{ width: "4vmax", height: "4vmax", marginRight: 2, cursor: "pointer" }} name={user.name} src={user.avatar.url} />
            <Box>
                <Typography>{user.name}</Typography>
                <Typography fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Typography>
            </Box>
        </Box >
    )
}

export default UserListItem