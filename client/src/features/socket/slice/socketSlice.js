import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        isLoading: false,
        isError: false,
        socketId: null
    },
    reducers: {
        setSocket: (state, action) => {
            state.isLoading = true;
            const socketId = action.payload;
            if (socketId) {
                state.socketId = socketId;
                state.isLoading = false;
            } else {
                state.isLoading = false;
                state.isError = true;
            }
        },
    }
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;

export const selectSocket = (state) => state.socket.socket;