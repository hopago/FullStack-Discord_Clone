import { current } from "@reduxjs/toolkit";
import { apiSlice } from "../../authentication/api/apiSlice";
import { conversationsApiSlice } from "../../conversation/slice/conversationsApiSlice";

export const friendRequestApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAllFriendRequest: builder.query({
                query: () => '/friends',
                provideTags: (result, error, arg) => [
                    ...result.map(({ _id }) => ({ type: "FriendRequest", id: _id }))
                ]
            }),
            getReceivedCount: builder.query({
                query: () => '/friends/count',
                providesTags: (result, error, arg) => [
                    { type: 'FriendRequest', id: result._id }
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