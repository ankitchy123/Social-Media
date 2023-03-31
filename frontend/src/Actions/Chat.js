import axios from "axios";

export const fetchAllChats = () => async (dispatch) => {
    try {
        dispatch({
            type: "allChatsRequest"
        });
        const { data } = await axios.get(`/api/v1/chat`)
        dispatch({
            type: "allChatsSuccess",
            payload: data.results
        })
    } catch (error) {
        dispatch({
            type: "allChatsFailure",
            payload: error.response.data.message
        })
    }
}

export const accessChat = (userId) => async (dispatch) => {
    try {
        dispatch({
            type: "accessChatRequest"
        });
        const { data } = await axios.post(`/api/v1/chat`, {
            userId
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: "accessChatSuccess",
            payload: data.FullChat
        })
    } catch (error) {
        dispatch({
            type: "accessChatFailure",
            payload: error.response.data.message
        })
    }
}

export const createGroup = (name, users) => async (dispatch) => {
    try {
        dispatch({
            type: "createGroupRequest"
        });
        const { data } = await axios.post(`/api/v1/chat/group`, {
            name, users
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: "createGroupSuccess",
            payload: data.fullGroupChat
        })
    } catch (error) {
        dispatch({
            type: "createGroupFailure",
            payload: error.response.data.message
        })
    }
}