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
                query: (userId) => `/users/${userId}/friends`,
                providesTags: (result, err, arg) => {
                    return [
                        ...result.map(({ _id }) => ({
                            type: 'User', id: _id
                        }))
                    ]
                }
            }),
            getSingleFriend: builder.query({
                query: (userId, friendId) => `/users/${userId}/friends/${friendId}`,
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
    useLazyGetAllFriendsQuery,
    useGetSingleFriendQuery,
    useUpdateUserMutation,
    useRemoveFriendMutation
} = usersApiSlice;