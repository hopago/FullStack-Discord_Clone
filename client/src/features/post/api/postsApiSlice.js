import { apiSlice } from "../../authentication/api/apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            keepUnusedDataFor: 60,
        })
    })
});

export const {
    useGetPostsQuery,
} = usersApiSlice;