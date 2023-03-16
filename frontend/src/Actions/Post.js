import axios from "axios";

export const likePost = (postId) => async (dispatch) => {
    try {
        dispatch({
            type: "likeRequest"
        });
        const { data } = await axios.get(`/api/v1/post/${postId}`)
        dispatch({
            type: "likeSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "likeFailure",
            payload: error.response.data.message
        })
    }
};

export const addcommentOnPost = (postId, comment) => async (dispatch) => {
    try {
        dispatch({
            type: "addCommentRequest"
        });
        const { data } = await axios.put(`/api/v1/post/comment/${postId}`, {
            comment
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: "addCommentSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "addCommentFailure",
            payload: error.response.data.message
        })
    }
};

export const deleteCommentOnPost = (postId, commentId) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteCommentRequest"
        });
        const { data } = await axios.delete(`/api/v1/post/comment/${postId}`, {
            data: { commentId }
        })
        dispatch({
            type: "deleteCommentSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deleteCommentFailure",
            payload: error.response.data.message
        })
    }
};

export const createNewPost = (caption, image) => async (dispatch) => {
    try {
        dispatch({
            type: "newPostRequest"
        });
        const { data } = await axios.post(`/api/v1/post/upload`, {
            caption, image
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: "newPostSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "newPostFailure",
            payload: error.response.data.message
        })
    }
};

export const updatePost = (caption, postId) => async (dispatch) => {
    try {
        dispatch({
            type: "updateCaptionRequest"
        });
        const { data } = await axios.put(`/api/v1/post/${postId}`, {
            caption
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: "updateCaptionSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "updateCaptionFailure",
            payload: error.response.data.message
        })
    }
};

export const deletePost = (postId) => async (dispatch) => {
    try {
        dispatch({
            type: "deletePostRequest"
        });
        const { data } = await axios.delete(`/api/v1/post/${postId}`)
        dispatch({
            type: "deletePostSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deletePostFailure",
            payload: error.response.data.message
        })
    }
};