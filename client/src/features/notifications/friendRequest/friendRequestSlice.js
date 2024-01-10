import { createSlice } from "@reduxjs/toolkit";

const friendRequestSlice = createSlice({
    name: 'friendRequest',
    initialState: {
        notifications: [],
        seenNotifications: [],
        notSeenNotifications: []
    },
    reducers: {
        setNotifications: (state, action) => {
            const notifications = action.payload;
            state.notifications = notifications;
        },
        classifyNotifications: (state) => {
            if (state.notifications.length > 0) {
                state.notifications.forEach((item) => {
                    const targetState = item.isRead ? state.seenNotifications : state.notSeenNotifications;
                    const checkDuplicated = targetState.some(ele => ele._id === item._id || ele.type === item.type);

                    if (!checkDuplicated) {
                        if (item.isRead) {
                            state.seenNotifications = [...state.seenNotifications, item];
                        } else {
                            state.notSeenNotifications = [...state.notSeenNotifications, item];
                        }
                    }
                });
            }
        },
        socket_addCount: (state) => {
            state.notSeenNotifications.length = state.notSeenNotifications.length + 1;
        },
        seeNotification: (state, action) => {
            const { _id } = action.payload;
            const currNotification = state.notSeenNotifications.find(item => item._id === _id);
            if (currNotification) {
                state.notSeenNotifications = state.notSeenNotifications.filter(item => item._id !== _id);
                state.seenNotifications = [...state.seenNotifications, currNotification];
            }
        }
    },
});

export const { setNotifications, classifyNotifications, socket_addCount, seeNotification } = friendRequestSlice.actions;

export default friendRequestSlice.reducer;

export const selectCurrNotifications = (state) => state.friendRequest.notifications;
export const selectSeenNotifications = (state) => state.friendRequest.seenNotifications;
export const selectNotSeenNotifications = (state) => state.friendRequest.notSeenNotifications;