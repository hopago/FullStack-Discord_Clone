import { apiSlice } from "../../authentication/api/apiSlice";

{/* 12 05 22 40 */}

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
                query: () => ({
                    url: "/friends/notifications",
                    body: {
                        
                    }
                })
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
                async onQueryStarted ({ senderId }, { dispatch, queryFulfilled }) {
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

            }),
            seeNotification: builder.mutation({

            }),
            deleteNotification: builder.mutation({

            })
        }
    )
});

export const {
    useLazyGetAllFriendRequestQuery,
    useGetReceivedCountQuery,
    useSendFriendMutation,
    useHandleRequestFriendMutation
} = friendRequestApiSlice;