import { current } from "@reduxjs/toolkit";
import { apiSlice } from "../../authentication/api/apiSlice";

export const commentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getComments: builder.query({
                query: ({ fetchType, fetchCount, postId }) => `/comments?sort=${fetchType}&fetchCount=${fetchCount}&postId=${postId}`,
                providesTags: (result, error, arg) => {
                    return [
                        { type: 'Comment', id: "LIST" },
                        ...result.map(({ _id }) => ({
                            type: 'Comment', id: _id
                        }))
                    ];
                }
            }),
            getComment: builder.query({
                query: commentId => `/comments/${commentId}`,
                providesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            getCommentsLength: builder.query({
                query: postId => `/comments/length?postId=${postId}`,
            }),
            addComment: builder.mutation({
                query: ({ description, postId }) => ({
                    url: '/comments',
                    method: 'POST',
                    body: {
                        postId,
                        description
                    }
                }),
                invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
            }),
            updateComment: builder.mutation({
                query: ({ commentId, description }) => ({
                    url: `/comments/${commentId}`,
                    method: 'PUT',
                    body: {
                        description
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            deleteComment: builder.mutation({
                query: commentId => ({
                    url: `/comments/${commentId}`,
                    method: 'DELETE'
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ],
            }),
            replyComment: builder.mutation({
                query: ({ commentId, description }) => ({
                    url: `/comments/reply/${commentId}`,
                    method: 'PUT',
                    body: {
                        description
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            updateReplyComment: builder.mutation({
                query: ({ commentId, description, originDescription }) => ({
                    url: `/comments/reply/edit/${commentId}`,
                    method: 'PUT',
                    body: {
                        originDescription,
                        description
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            deleteReplyComment: builder.mutation({
                query: ({ commentId, description }) => ({
                    url: `/comments/reply/edit/${commentId}`,
                    method: 'DELETE',
                    body: {
                        description
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            likeComment: builder.mutation({
                query: ({ commentId }) => ({
                    url: `/comments/like/${commentId}`,
                    method: 'PUT'
                }),

                async onQueryStarted({ fetchCount, fetchType, postId, currentUserId, commentId }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        commentsApiSlice.util.updateQueryData('getComments', { fetchCount, fetchType, postId }, draftComment => {
                            draftComment.map(comment => {
                                if (comment._id === commentId) {
                                    const isExist = comment.comments[0].comment_reply.includes(currentUserId);
                                    if (!isExist) return comment.comments[0].comment_like_count.push(currentUserId);

                                    const findIndex = comment.comments[0].comment_reply.findIndex(userId => userId === currentUserId);
                                    if (findIndex === - 1) return console.log("Something went wrong in commentsApiSlice..."); // for dev

                                    return comment.comments[0].comment_like_count.splice(findIndex, 1);
                                } else {
                                    return;
                                }
                            })
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
    useGetCommentsQuery,
    useGetCommentQuery,
    useGetCommentsLengthQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useReplyCommentMutation,
    useUpdateReplyCommentMutation,
    useDeleteReplyCommentMutation,
    useLikeCommentMutation
} = commentsApiSlice;