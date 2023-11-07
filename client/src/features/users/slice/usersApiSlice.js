import { apiSlice } from "../../authentication/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getCurrentUser: builder.query({
                query: () => '/users',
            }),
            findUserById: builder.query({
                query: (userId) => `/users/${userId}`,
                keepUnusedDataFor: 60,
            }),
        }
    )
});

export const {
    useGetCurrentUserQuery,
    useFindUserByIdQuery,
} = usersApiSlice;