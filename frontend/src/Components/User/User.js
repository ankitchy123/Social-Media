import React from 'react'
import { Link } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import "./User.css"

const User = ({ userId, name, avatar }) => {
    return (
        <Link to={`/user/${userId}`} className='homeUser'>
            <img src={avatar} alt={name} />
            <Typography>{name}</Typography>
        </Link>
    )
}

export default User