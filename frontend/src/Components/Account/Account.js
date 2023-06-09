import { Avatar, Button, Dialog, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteMyProfile, getMyPosts, loadUser, logoutUser } from '../../Actions/User'
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import User from '../User/User'
import "./Account.css"

const Account = () => {
    const dispatch = useDispatch()
    const alert = useAlert();
    const { user, loading: userLoading } = useSelector((state) => state.user)
    const { loading, error, posts } = useSelector((state) => state.myPosts)
    const { error: likeError, message, loading: deleteLoading } = useSelector((state) => state.like)

    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)


    const logoutHandler = async () => {
        await dispatch(logoutUser())
        alert.success("Logged out successfully")
    }

    const deleteProfileHandler = async () => {
        await dispatch(deleteMyProfile())
        dispatch(logoutUser())
    }

    useEffect(() => {
        dispatch(getMyPosts())
        dispatch(loadUser())
    }, [dispatch])


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
    }, [alert, error, message, likeError, dispatch, user])

    return (
        loading === true || userLoading === true ?
            <Loader /> :
            <div className='account'>
                <div className="accountleft">
                    {posts && posts.length > 0 ? posts.map((post) => (
                        <Post
                            key={post._id}
                            postImage={post.image.url}
                            caption={post.caption}
                            account="myaccount"
                            postId={post._id}
                            likes={post.likes}
                            comments={post.comments}
                            ownerName={post.owner.name}
                            ownerImage={post.owner.avatar.url}
                            ownerId={post.owner._id}
                            isDelete={true}
                        />
                    )) : <Typography variant='h6'>You have not made any post</Typography>}
                </div>
                <div className="accountright">
                    <Avatar src={user.avatar.url} sx={{ height: "8vmax", width: "8vmax" }} />
                    <Typography variant='h5'>{user.name}</Typography>

                    <div>
                        <button onClick={() => setFollowersToggle(!followersToggle)}>
                            <Typography>Followers</Typography>
                        </button>
                        <Typography>{user.followers.length}</Typography>
                    </div>

                    <div>
                        <button onClick={() => setFollowingToggle(!followingToggle)}>
                            <Typography>Following</Typography>
                        </button>
                        <Typography>{user.following.length}</Typography>
                    </div>

                    <div>
                        <Typography>Posts</Typography>
                        <Typography>{user.posts.length}</Typography>
                    </div>

                    <Button variant='contained' onClick={logoutHandler}>Logout</Button>

                    <Link to="/update/profile">Edit Profile</Link>
                    <Link to="/update/password">Change Password</Link>

                    <Button variant='text' style={{ color: "red", margin: "2vmax" }} onClick={deleteProfileHandler} disable={deleteLoading}>
                        Delete My Profile
                    </Button>


                    <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                        <div className="DialogBox">
                            <Typography variant='h4'>Followers</Typography>
                            {user && user.followers.length > 0 ? (user.followers.map((item) => (
                                <User
                                    key={item._id}
                                    userId={item._id}
                                    name={item.name}
                                    avatar={item.avatar.url}
                                />
                            ))) : <Typography style={{ margin: "2vmax" }}>You have no followers</Typography>}
                        </div>
                    </Dialog>

                    <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
                        <div className="DialogBox">
                            <Typography variant='h4'>Following</Typography>
                            {user && user.following.length > 0 ? (user.following.map((item) => (
                                <User
                                    key={item._id}
                                    userId={item._id}
                                    name={item.name}
                                    avatar={item.avatar.url}
                                />
                            ))) : <Typography style={{ margin: "2vmax" }}>You're not following anyone</Typography>}
                        </div>
                    </Dialog>
                </div>
            </div >
    )
}

export default Account