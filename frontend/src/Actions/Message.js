import axios from "axios";

export const fetchMessages = (chatId) => async (dispatch) => {
    try {
        dispatch({
            type: "fetchMessageRequest"
        });
        const { data } = await axios.get(`/api/v1/message/${chatId}`)
        dispatch({
            type: "fetchMessageSuccess",
            payload: data.messages
        })
    } catch (error) {
        dispatch({
            type: "fetchMessageFailure",
            payload: error.response.data.message
        })
    }
}