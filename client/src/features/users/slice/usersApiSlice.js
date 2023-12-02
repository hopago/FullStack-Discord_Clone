import { apiSlice } from "../../authentication/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getCurrentUser: builder.query({
                query: () => '/users',
                providesTags: (result, err, arg) => [
                    { type: 'User', id: result._id }
                ]
            }),
            findUserById: builder.query({
                query: _id => `/users/${_id}`,
                providesTags: (result, err, arg) => [
                    { type: 'User', id: arg }
                ],
            }),
            getAllFriends: builder.query({
                query: () => `/users/friends`,
                providesTags: (result, err, arg) => {
                    return [
                        ...result.map(({ _id }) => ({
                            type: 'User', id: _id
                        }))
                    ]
                }
            }),
            getSingleFriend: builder.query({
                query: (friendId) => `/users/friends/${friendId}`,
                providesTags: (result, error, arg) => [
                    { type: 'User', id: arg }
                ]
            }),
            updateUser: builder.mutation({
                query: updatedUserInfo => ({
                    url: '/users',
                    method: 'PUT',
                    body: {
                        ...updatedUserInfo
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: result._id }
                ],
            }),
            addMemo: builder.mutation({
                query: (friendId, memo) => ({
                    url: `/users/friends/${friendId}`,
                    method: 'PUT',
                    body: {
                        memo
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: result._id }
                ]
            }),
            handleCloseFriends: builder.mutation({
                query: friendId => ({
                    url: `/users/friends/close/${friendId}`,
                    method: 'PUT',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: result._id }
                ]
            }),
            removeFriend: builder.mutation({
                query: (friendId) => ({
                    url: `/users/friends/${friendId}`,
                    method: 'DELETE'
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: arg }
                ]
            }),
        }
    )
});

export const {
    useGetCurrentUserQuery,
    useFindUserByIdQuery,
    useLazyFindUserByIdQuery,
    useLazyGetAllFriendsQuery,
    useGetSingleFriendQuery,
    useUpdateUserMutation,
    useRemoveFriendMutation
} = usersApiSlice;