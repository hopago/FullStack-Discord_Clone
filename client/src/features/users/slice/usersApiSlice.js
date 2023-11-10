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
        }
    )
});

export const {
    useGetCurrentUserQuery,
    useFindUserByIdQuery,
} = usersApiSlice;