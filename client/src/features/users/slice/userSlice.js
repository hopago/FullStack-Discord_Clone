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
        userLogout: (state) => {
            state.currentUser = null;
        }
    }
});

export const { setCurrentUser, userLogout } = usersSlice.actions;

export default usersSlice.reducer;

export const selectCurrentUser = (state) => state.user.currentUser;