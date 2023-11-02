import { apiSlice } from '../../authentication/api/apiSlice';

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getLatestPosts: builder.query({
                query: () => '/posts/latest',
                providesTags: (result, error, arg) => [
                    { type: 'Post', id: "LIST" },
                    ...result.ids.map(id => ({ 
                        type: 'Post', id 
                    }))
                ],
                keepUnusedDataFor: 60,
            }),
            getTrendPosts: builder.query({
                query: () => '/posts/trend',
                providesTags: (result, error, arg) => [
                    { type: 'Post', id: "LIST" },
                    ...result.ids.map(id => ({
                        type: 'Post', id
                    }))
                ],
                keepUnusedDataFor: 60
            }),
            findByPostsCategory: builder.query({
                query: (categories) => `/posts/?category=${categories}`,
                providesTags: (result, error, arg) => [
                    { type: 'Post', id: 'LIST' },
                    ...result.ids.map(id => ({
                        type: 'Post', id
                    }))
                ],
                keepUnusedDataFor: 60
            }),
            getPostsByUserId: builder.query({
                query: id => `/posts/?authorId=${id}`,
                providesTags: (result, error, arg) => [
                    ...result.ids.map(id => ({ type: 'Post', id }))
                ]
            }),
            getPost: builder.query({
                query: id => `/posts/${id}`,
                providesTags: (result, error, arg) => [
                    { type: 'Post', id: arg._id }
                ],
            }),
            addNewPost: builder.mutation({
                query: initialPost => ({
                    url: '/posts',
                    method: 'POST',
                    body: {
                        ...initialPost,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }),
                invalidatesTags: [
                    { type: 'Post', id: "LIST" }
                ]
            }),
            updatePost: builder.mutation({
                query: initialPost => ({
                    url: `/posts/${initialPost._id}`,
                    method: 'PUT',
                    body: {
                        ...initialPost,
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Post', id: arg._id }
                ]
            }),
            deletePost: builder.mutation({
                query: initialPost => ({
                    url: `/posts/${initialPost._id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Post', id: arg._id }
                ]
            }),
            likePost: builder.mutation({
                query: (initialPost, reactionName, fetchType, currentUser) => ({
                    url: `/like/${initialPost._id}`,
                    method: 'PUT',
                    body: {
                        reactionName,
                        currentUserId: currentUser._id
                    }
                }),
                async onQueryStarted({ initialPost, reactionName, fetchType, currentUser }, { dispatch, queryFulfilled }) {
                    let url;
                    switch (fetchType) {
                        case 'hot':
                            url = 'getTrendPosts'
                            break;
                        case 'recommend':
                            url = 'findByPostsCategory'
                            break;
                        case 'latest':
                            url = 'getLatestPosts'
                            break;
                        case 'single':
                            url = 'getPost'
                            break;
                        default:
                            url = 'getLatestPosts'
                            break;
                    }

                    const patchResult = dispatch(
                        postsApiSlice.util.updateQueryData(`${url}`, undefined, draft => {
                            const post = draft.entities[initialPost._id];

                            if (post) {
                                if (!post.reactions[reactionName].includes(currentUser._id)) {
                                    post.reactions[reactionName]++;
                                } else {
                                    post.reactions[reactionName]--;
                                }
                            }
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
    useGetLatestPostsQuery,
    useGetTrendPostsQuery,
    useFindByPostsCategoryQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = usersApiSlice;