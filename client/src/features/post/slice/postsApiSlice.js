import { apiSlice } from '../../authentication/api/apiSlice';

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getPostsBySortOptions: builder.query({
                query: ({ fetchType, categories, language }) => ({
                    url: `/posts?sort=${fetchType}&categories=${categories}&language=${language}`,
                    transformResponse: (res) => {
                        if (res.status === 400) {
                            return []
                        }
                        console.log(res);
                        return res;
                    }
                }),
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            { type: 'Post', id: "LIST" },
                            ...result.map(({ _id }) => ({
                                type: 'Post', id: _id
                            }))
                        ];
                    } else {
                        return [];
                    }
                },
            }),
            getPostsByAuthorId: builder.query({
                query: id => `/posts/author/${id}`,
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            ...result.map(({ _id }) => ({ type: 'Post', id: _id }))
                        ]
                    } else {
                        return [];
                    }
                }
            }),
            getTrendPostsByAuthorId: builder.query({
                query: id => `/posts/author/trend/${id}`,
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            ...result.map(({ _id }) => ({ type: 'Post', id: _id }))
                        ]
                    } else {
                        return [];
                    }
                }
            }),
            getPostReactions: builder.query({
                query: id => `/posts/reactions/${id}`,
            }),
            getPost: builder.query({
                query: _id => `/posts/${_id}`,
                providesTags: (result, error, arg) => [
                    { type: 'Post', id: arg }
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
                query: updatedPost => ({
                    url: `/posts/${updatedPost._id}`,
                    method: 'PUT',
                    body: {
                        ...updatedPost,
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Post', id: arg._id }
                ]
            }),
            deletePost: builder.mutation({
                query: deletedPost => ({
                    url: `/posts/${deletedPost._id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Post', id: arg._id }
                ]
            }),
            likePost: builder.mutation({
                query: ({ initialPost, reactionName, currentUser }) => ({
                    url: `/posts/like/${initialPost._id}`,
                    method: 'PATCH',
                    body: {
                        reactionName,
                        currentUserId: currentUser._id
                    }
                }),
                async onQueryStarted({ initialPost, reactionName, currentUser }, { dispatch, queryFulfilled }) {
                    const { _id } = initialPost;

                    const patchResult = dispatch(
                        postsApiSlice.util.updateQueryData('getPost', _id, draftPost => {
                            const findIndex = draftPost.reactions[reactionName].findIndex(_id => _id === currentUser._id);
                            const isExist = draftPost.reactions[reactionName].includes(currentUser._id);

                            if (!isExist) {
                                draftPost.reactions[reactionName].push(currentUser._id);
                            } else {
                                draftPost.reactions[reactionName].splice(findIndex, 1);
                            }
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            }),
            addViewOnPost: builder.mutation({
                query: postId => ({
                    url: `/posts/views/${postId}`,
                    method: 'PATCH',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Post', id: arg }
                ]
            })
        }
    )
});

export const {
    useGetPostsBySortOptionsQuery,
    useGetPostsByAuthorIdQuery,
    useLazyGetPostsByAuthorIdQuery,
    useGetTrendPostsByAuthorIdQuery,
    useLazyGetTrendPostsByAuthorIdQuery,
    useLazyGetPostReactionsQuery,
    useGetPostQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useAddViewOnPostMutation,
} = postsApiSlice;