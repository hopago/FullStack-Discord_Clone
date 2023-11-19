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
            })
        }
    )
});

export const {
    useGetCurrentUserQuery,
    useFindUserByIdQuery,
    useUpdateUserMutation,
} = usersApiSlice;