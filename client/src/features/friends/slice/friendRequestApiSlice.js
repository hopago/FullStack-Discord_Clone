import { apiSlice } from "../../authentication/api/apiSlice";

export const friendRequestApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAllFriendRequest: builder.query({
                query: () => '/friends',
                provideTags: (result, error, arg) => [
                    ...result.map(({ _id }) => ({ type: "FriendRequest", id: _id }))
                ]
            }),
            sendFriend: builder.mutation({
                query: ({ userName, tag }) => ({
                    url: `/friends?userName=${userName}&tag=${tag}`,
                    method: 'PUT'
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'FriendRequest', id: result._id }
                ]
            }),
            handleRequestFriend: builder.mutation({
                query: ({ senderId, isAccepted }) => ({
                    url: `/friends/${senderId}`,
                    method: 'PUT',
                    body: { isAccepted }
                }),
                onQueryStarted: async ({ senderId }, { dispatch, queryFulfilled }) => {
                    const patchResult = dispatch(
                        friendRequestApiSlice.util.updateQueryData('getAllFriendRequest', undefined, draftRequestList => {
                            draftRequestList.table.members = draftRequestList.table.members.filter(member => member._id !== senderId);
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
    useSendFriendMutation,
    useHandleRequestFriendMutation
} = friendRequestApiSlice;