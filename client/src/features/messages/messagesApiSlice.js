import { apiSlice } from "../authentication/api/apiSlice";

export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getMessages: builder.query({
                query: ({ conversationId, fetchCount }) => ({
                    url: `/private/messages/conversation/${conversationId}?fetchCount=${fetchCount}`,
                    transformResponse: (response) => {
                        if (response.status === 404) {
                            return [];
                        }
                        return response;
                    }
                }),
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [...result.map(({ _id }) => ({
                            type: 'Private_Messages', id: _id
                        }))]
                    } else {
                        return [];
                    }
                }
            }),
            createMessage: builder.mutation({
                query: ({ conversationId, message }) => ({
                    url: `/private/messages/conversation/${conversationId}`,
                    method: 'POST',
                    body: {
                        ...message
                    }
                }),
                providesTags: (result, error, arg) => {
                    return { type: "Private_Messages", id: result._id }
                }
            }),
            updateMessage: builder.mutation({
                query: ({ messageId, message }) => ({
                    url: `/private/messages/${messageId}`,
                    method: 'PUT',
                    body: {
                        ...message
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Private_Messages', id: result._id }
                ]
            }),
            deleteMessage: builder.mutation({
                query: ({ messageId }) => ({
                    url: `/private/messages/${messageId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Private_Messages', id: arg.messageId }
                ]
            })
        }
    )
});

export const {
    useGetMessagesQuery,
    useLazyGetMessagesQuery,
    useUpdateMessageMutation,
    useCreateMessageMutation,
    useDeleteMessageMutation
} = messagesApiSlice;