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
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            w="100%" d="flex"
            alignItems="center"
            color="black"
            px={3} py={2} mb={2} borderRadius="lg"
        >
            <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.avatar.url} />
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