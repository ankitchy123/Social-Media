import { createReducer } from "@reduxjs/toolkit";

const initialState = {}
export const allChatsReducer = createReducer(initialState, {
    allChatsRequest: (state) => {
        state.loading = true;
    },
    allChatsSuccess: (state, action) => {
        state.loading = false;
        state.allChats = action.payload;
    },
    allChatsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    accessChatRequest: (state) => {
        state.loading = true;
    },
    accessChatSuccess: (state, action) => {
        state.loading = false;
        state.singleChat = action.payload;
    },
    accessChatFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    createGroupRequest: (state) => {
        state.loading = true;
    },
    createGroupSuccess: (state, action) => {
        state.loading = false;
        state.group = action.payload;
    },
    createGroupFailure: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    clearErrors: (state) => {
        state.error = null
    },
    clearMessage: (state) => {
        state.message = null
    }
})