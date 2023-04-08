import { Avatar, Box, Button, Dialog, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteMyProfile, getMyPosts, loadUser, logoutUser } from '../../Actions/User'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import User from '../User/User'
import "./Account1.css"

const Account1 = () => {
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
            <div className='account1'>
                <div className='accountContainer'>
                    <div className='accountTop'>
                        <Avatar sx={{ width: "10vmax", height: "10vmax" }} src={user.avatar.url} />
                        <div className='block1'>
                            <div className='editProfile'>
                                <Typography sx={{ fontSize: "2vmax", textAlign: "center" }} variant='h5'>{user.name}</Typography>
                                <Link to="/update/profile">Edit Profile</Link>
                                {/* <LogoutIcon sx={{}} onClick={logoutHandler} /> */}
                                <Button variant='contained' onClick={logoutHandler}>Logout</Button>
                            </div>
                            <div className='editContainer'>
                                <Link to="/update/profile">Edit Profile</Link>
                            </div>
                            <div className='followersBlock'>
                                <div>
                                    {/* <Typography sx={{ marginRight: "1vmax" }}>{user.posts.length}</Typography> */}
                                    <Typography>{user.posts.length} Posts</Typography>
                                </div>
                                <div>
                                    {/* <Typography>{user.followers.length}</Typography> */}
                                    <button onClick={() => setFollowersToggle(!followersToggle)}>
                                        <Typography>{user.followers.length} Followers</Typography>
                                    </button>
                                </div>
                                <div>
                                    {/* <Typography>{user.following.length}</Typography> */}
                                    <button onClick={() => setFollowingToggle(!followingToggle)}>
                                        <Typography>{user.following.length} Following</Typography>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='followContainer'>
                        <div>
                            <Typography sx={{ marginRight: "2vmax" }}>{user.posts.length}</Typography>
                            <Typography>Posts</Typography>
                        </div>
                        <div>
                            <Typography>{user.followers.length}</Typography>
                            <button onClick={() => setFollowersToggle(!followersToggle)}>
                                <Typography>Followers</Typography>
                            </button>
                        </div>
                        <div>
                            <Typography>{user.following.length}</Typography>
                            <button onClick={() => setFollowingToggle(!followingToggle)}>
                                <Typography>Following</Typography>
                            </button>
                        </div>
                    </div>
                    <div className='myPosts'>
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
                        )) : <Box className="noposts" sx={{ width: "fit-content", margin: "auto", textAlign: "center", padding: "5vmax 0" }}>
                            <CameraAltOutlinedIcon sx={{ width: "7vmax", height: "7vmax" }} />
                            <Typography variant='h3'>Share Photos</Typography>
                            <Typography variant='h6'>When you share photos, they will appear on your profile.</Typography>
                            <Link to="/newpost">Share your first photo</Link>
                        </Box>}
                    </div>
                </div>
                <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                    <div className="followDialogBox">
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
                    <div className="followDialogBox">
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
    )
}

export default Account1