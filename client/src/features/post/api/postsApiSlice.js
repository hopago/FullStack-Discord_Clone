import { apiSlice } from "../../authentication/api/apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLatestPosts: builder.query({
            query: () => '/posts/latest',
            keepUnusedDataFor: 60,
        })
    })
});

export const {
    useGetLatestPostsQuery,
} = usersApiSlice;