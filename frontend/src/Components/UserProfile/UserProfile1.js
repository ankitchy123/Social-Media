import { Avatar, Box, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    followAndUnfollowUser,
    getUserPosts,
    getUserProfile,
} from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./UserProfile1.css"
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Account1 from "../Account/Account1";

const UserProfile1 = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const alert = useAlert();

    const { user, loading: userLoading, error: userError, } = useSelector((state) => state.userProfile);
    const { user: me } = useSelector((state) => state.user);
    const { loading, error, posts } = useSelector((state) => state.userPosts);
    const { error: followError, message, loading: followLoading } = useSelector((state) => state.like);

    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    const [following, setFollowing] = useState(false);
    const [myProfile, setMyProfile] = useState(false);

    const followHandler = async () => {
        setFollowing(!following);
        await dispatch(followAndUnfollowUser(user._id));
        dispatch(getUserProfile(params.id));
    };

    useEffect(() => {
        dispatch(getUserPosts(params.id));
        dispatch(getUserProfile(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (me._id === params.id) {
            setMyProfile(true);
        }
        if (user) {
            user.followers.forEach((item) => {
                if (item._id === me._id) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
        }
    }, [user, me._id, params.id]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (followError) {
            alert.error(followError);
            dispatch({ type: "clearErrors" });
        }

        if (userError) {
            alert.error(userError);
            dispatch({ type: "clearErrors" });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }
    }, [alert, error, message, followError, userError, dispatch]);


    return (
        loading === true || userLoading === true ?
            <Loader /> :
            (myProfile ? <Account1 /> :
                user && <div className='account1'>
                    <div className='accountContainer'>
                        <div className='accountTop'>
                            <Avatar sx={{ width: "10vmax", height: "10vmax" }} src={user.avatar.url} />
                            <div className='block1'>
                                <div className='editProfile'>
                                    <Typography sx={{
                                        marginRight: "1vmax",
                                        fontSize: "2vmax",
                                    }} variant='h5'>{user.name}</Typography>
                                    <Button
                                        variant="contained"
                                        style={{ background: following ? "red" : "", marginRight: "1vmax" }}
                                        onClick={followHandler}
                                        disabled={followLoading}
                                    >
                                        {following ? "Unfollow" : "Follow"}
                                    </Button>
                                    <Link to="/message"
                                    >
                                        Message
                                    </Link>
                                </div>
                                <div className='followersBlock'>
                                    <div>
                                        <Typography>{user.posts.length} Posts</Typography>
                                    </div>
                                    <div>
                                        <button onClick={() => setFollowersToggle(!followersToggle)}>
                                            <Typography>{user.followers.length} Followers</Typography>
                                        </button>
                                    </div>
                                    <div>
                                        <button onClick={() => setFollowingToggle(!followingToggle)}>
                                            <Typography>{user.following.length} Following</Typography>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='followContainer'>
                            <div>
                                <Typography sx={{ marginRight: "1vmax" }}>{user.posts.length}</Typography>
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
                                <Typography variant='h3'>No Posts Yet</Typography>
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
    )
}

export default UserProfile1