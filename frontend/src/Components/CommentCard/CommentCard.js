import React from 'react'
import "./CommentCard.css"
import { Link } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCommentOnPost } from '../../Actions/Post'
import { getFollowingPosts, getMyPosts, getUserPosts } from '../../Actions/User'

const CommentCard = ({ ownerId, userId, name, avatar, comment, commentId, postId, account }) => {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const deleteCommentHandler = async () => {
        await dispatch(deleteCommentOnPost(postId, commentId))

        if (account === "home") {
            dispatch(getFollowingPosts())
        }
        else if (account === "myaccount") {
            dispatch(getMyPosts())
        }
        else {
            dispatch(getUserPosts(ownerId))
        }
    }

    return (
        <div className='commentUser'>
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
            </Link>
            <Typography style={{ marginLeft: "1vmax" }}>{comment}</Typography>
            {account === "myaccount" ? <Button onClick={deleteCommentHandler}>
                <Delete />
            </Button> : userId === user._id ? <Button onClick={deleteCommentHandler}>
                <Delete />
            </Button> : null}
        </div>
    )
}

export default CommentCard