import { apiSlice } from "../../authentication/api/apiSlice";

{/* 12 05 22 40 */ }

export const friendRequestApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAllFriendRequest: builder.query({
                query: () => '/friends',
                provideTags: (result, error, arg) => [
                    { type: 'FriendRequest', id: result._id },
                    ...result.members.map(member => ({ type: 'FriendRequestMember', id: member._id }))
                ]
            }),
            getReceivedCount: builder.query({
                query: () => '/friends/count',
                providesTags: (result, error, arg) => [
                    { type: 'FriendRequest', id: result._id }
                ]
            }),
            getNotifications: builder.query({
                query: (fetchType) => `/friends/notifications?fetchType=${fetchType}`,
                providesTags: (result, error, arg) => [
                    { type: "Notification", id: "LIST" }
                ]
            }),
            sendFriend: builder.mutation({
                query: ({ userName, tag }) => ({
                    url: `/friends?userName=${userName}&tag=${tag}`,
                    method: 'POST'
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'FriendRequest', id: result._id },
                    { type: 'FriendRequestMember', id: result.senderId }
                ]
            }),
            handleRequestFriend: builder.mutation({
                query: ({ senderId, isAccepted }) => ({
                    url: `/friends/process/${senderId}`,
                    method: 'PUT',
                    body: {
                        isAccepted
                    }
                }),
                async onQueryStarted({ senderId }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        friendRequestApiSlice.util.updateQueryData('getAllFriendRequest', undefined, draftRequest => {
                            draftRequest[0].members = draftRequest[0].members.filter(
                                (friend) => friend._id !== senderId
                            );
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch (err) {
                        patchResult.undo();
                    }
                }
            }),
            createNotification: builder.mutation({
                query: ({ senderId, type = "friendRequest_send", userName, tag }) => ({
                    url: "/friends/notifications",
                    method: "POST",
                    body: {
                        senderId,
                        type,
                        userName,
                        tag
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "Notification", id: "LIST" }
                ]
            }),
            seeNotification: builder.mutation({
                query: (userName) => ({
                    url: `/friends/notifications`,
                    method: "PATCH",
                    body: {
                        userName
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "Notification", id: "LIST" }
                ]
            }),
            deleteNotification: builder.mutation({
                query: ({ userName }) => ({
                    url: "/friends/notifications",
                    method: "DELETE",
                    body: {
                        userName
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "Notification", id: "LIST" }
                ],

                async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        friendRequestApiSlice.util.updateQueryData('getNotifications', _id, draftNotifications => {
                          const findIndex = draftNotifications.findIndex(item => item._id === _id);

                          draftNotifications.splice(findIndex, 1);
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            })
        }
    )
});

export const {
    useLazyGetAllFriendRequestQuery,
    useGetReceivedCountQuery,
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery,
    useCreateNotificationMutation,
    useSeeNotificationMutation,
    useDeleteNotificationMutation,
    useSendFriendMutation,
    useHandleRequestFriendMutation
} = friendRequestApiSlice;