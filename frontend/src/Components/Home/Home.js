import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, getFollowingPosts } from '../../Actions/User'
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import User from '../User/User'
import { useAlert } from "react-alert"
import "./Home.css"

const Home = () => {
    const dispatch = useDispatch();
    const { loading: usersLoading, users } = useSelector((state) => state.allUsers)
    const { loading, posts, error } = useSelector((state) => state.postOfFollowing)
    const { error: likeError, message } = useSelector((state) => state.like)
    const alert = useAlert();

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (likeError) {
            alert.error(likeError)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }
    }, [alert, error, message, likeError, dispatch])

    useEffect(() => {
        dispatch(getFollowingPosts())
        dispatch(getAllUsers())
    }, [dispatch])

    return (
        loading || usersLoading ? <Loader /> : (
            <div className='home'>
                <div className="homeleft">
                    {posts && posts.length > 0 ? posts.map((post) => (
                        <Post
                            key={post._id}
                            postImage={post.image.url}
                            caption={post.caption}
                            account={"home"}
                            postId={post._id}
                            likes={post.likes}
                            comments={post.comments}
                            ownerName={post.owner.name}
                            ownerImage={post.owner.avatar.url}
                            ownerId={post.owner._id}
                        />
                    )) : <Typography variant='h6'>No posts yet</Typography>}
                </div>
                <div className="homeright">
                    {users && users.length > 0 ? users.map((user) => (
                        <User key={user._id} userId={user._id} name={user.name} avatar={user.avatar.url} />
                    )) : <Typography>No Users Yet</Typography>}
                </div>
            </div>
        )
    )
}

export default Home