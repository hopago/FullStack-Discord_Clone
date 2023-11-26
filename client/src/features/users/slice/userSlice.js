import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            const user = action.payload;
            state.currentUser = user;
        },
        logout: (state) => {
            state.currentUser = null;
        }
    }
});

export const { setCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;

export const selectCurrentUser = (state) => state.user.currentUser;