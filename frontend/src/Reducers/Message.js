import { createReducer } from "@reduxjs/toolkit";

const initialState = {}
export const fetchMessageReducer = createReducer(initialState, {
    fetchMessageRequest: (state) => {
        state.loading = true;
    },
    fetchMessageSuccess: (state, action) => {
        state.loading = false;
        state.messages = action.payload;
    },
    fetchMessageFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    clearErrors: (state) => {
        state.error = null
    }
})