import { apiSlice } from "../../authentication/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: () => '/users',
            keepUnusedDataFor: 60,
        })
    })
});

export const {
    useGetUserQuery,
} = usersApiSlice;