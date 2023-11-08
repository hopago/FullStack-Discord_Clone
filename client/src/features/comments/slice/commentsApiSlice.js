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
                            type: 'Comment', _id
                        }))
                    ];
                }
            }),
            updateComment: builder.mutation({
                query: ({commentId, initialComment}) => ({
                    url: `/comments/${commentId}`,
                    method: 'PUT',
                    body: {
                        ...initialComment
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Comment', id: arg._id }
                ]
            }),
            deleteComment: builder.mutation({
                
            })
        }
    )
});