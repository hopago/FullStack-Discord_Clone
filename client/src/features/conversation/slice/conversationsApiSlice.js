import { apiSlice } from "../../authentication/api/apiSlice";

export const conversationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getConversations: builder.query({
                query: () => '/conversations',
                transformResponse: (response) => {
                    if (response.status === 400) {
                        return [];
                    }
                    console.log(response);
                    return response;
                },
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            { type: 'Conversation', id: 'LIST' },
                            ...result.map(({ _id }) => ({
                                type: 'Conversation', id: _id
                            }))
                        ]
                    }
                    else {
                        return [];
                    }
                }
            }),
            getSingleConversation: builder.query({
                query: (conversationId) => `/conversations/${conversationId}`,
                providesTags: (result, error, arg) => [
                    { type: 'Conversation', id: arg }
                ]
            }),
            getConversationByMemberId: builder.query({
                query: (id) => ({
                    url: `/conversations/private?friendId=${id}`
                }),
                providesTags: (result, error, arg) => {
                    return [
                        { type: 'Conversation', id: result?._id }
                    ]
                }
            }),
            updateConversation: builder.mutation({
                query: (conversationId) => `/conversations/${conversationId}`,
                invalidatesTags: (result, error, arg) => [
                    { type: 'Conversation', id: arg }
                ]
            }),
            deleteConversation: builder.mutation({
                query: (conversationId) => ({
                    url: `/conversations/${conversationId}`,
                    body: {
                        type: "block"
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "Conversation", id: arg }
                ]
            })
        }
    )
});

export const {
    useGetConversationsQuery,
    useGetSingleConversationQuery,
    useLazyGetConversationByMemberIdQuery,
    useUpdateConversationMutation,
    useDeleteConversationMutation
} = conversationsApiSlice;