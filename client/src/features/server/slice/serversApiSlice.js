import { apiSlice } from "../../authentication/api/apiSlice";

export const serversApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getUserServers: builder.query({
                query: (userId) => ({
                    url: `/servers?userId=${userId}`,
                    transformResponse: (response) => {
                        if (response.status === 400) {
                            return [];
                        }
                        console.log(response);
                        return response;
                    }
                }),
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            { type: 'Server', id: "LIST" },
                            ...result.map(({ _id }) => ({
                                type: 'Server', id: _id
                            }))
                        ];
                    } else {
                        return [];
                    }
                }
            }),
            getSingleServer: builder.query({
                query: ({ serverId }) => `/servers/${serverId}`,
                providesTags: (result, error, arg) => {
                    return [
                        { type: 'Server', id: arg.serverId }
                    ]
                }
            }),
            getMembers: builder.query({
                query: ({ serverId }) => `/servers/members/${serverId}`,
                providesTags: (result, error, arg) => {
                    return [
                        { type: 'Server', id: arg.serverId },
                    ]
                }
            }),
            searchServer: builder.query({
                query: ({ searchTerm }) => `/servers/search?searchTerm=${searchTerm}`,
                providesTags: (result, error, arg) => {
                    return [
                        { type: 'Server', id: "LIST" },
                        ...result.map(({ _id }) => ({
                            type: 'Server', id: _id
                        }))
                    ]
                }
            }),
            createServer: builder.mutation({
                query: ({ initialServer, thumbnail }) => ({
                    url: '/servers',
                    method: 'POST',
                    body: {
                        embeds: {
                            ...initialServer,
                            thumbnail
                        }
                    }
                }),
                invalidatesTags: [
                    { type: 'Server', id: 'LIST' }
                ]
            }),
            deleteUserServer: builder.mutation({
                query: ({ serverId }) => ({
                    url: `/servers?serverId=${serverId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Server', id: arg.serverId }
                ]
            }),
            updateServer: builder.mutation({
                query: ({ serverId, updatedServer }) => ({
                    url: `/servers/${serverId}`,
                    method: 'PUT',
                    body: {
                        ...updatedServer
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Server', id: arg.serverId }
                ]
            }),
            deleteServer: builder.mutation({
                query: ({ serverId }) => ({
                    url: `/servers/${serverId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Server', id: arg.serverId }
                ]
            }),
            updatedMembers: builder.mutation({
                query: ({ serverId, memberId, requestType }) => ({
                    url: `/servers/members/${serverId}?${requestType}=${memberId}`,
                    method: 'PUT'
                }),
                invalidatesTags: (result, error, arg) => {
                    if (result && Array.isArray(result) && result.length) {
                        return [
                            { type: 'Server', id: arg.serverId }
                        ]
                    } else {
                        return []
                    }
                }
            }),
            likeServer: builder.mutation({
                query: ({ serverId }) => ({
                    url: `/servers/like/${serverId}`,
                    method: 'PUT'
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Server', id: arg.serverId }
                ]
            })
        }
    )
});

export const {
    useGetUserServersQuery,
    useLazyGetUserServersQuery,
    useGetSingleServerQuery,
    useGetMembersQuery,
    useSearchServerQuery,
    useCreateServerMutation,
    useDeleteServerMutation,
    useUpdateServerMutation,
    useDeleteUserServerMutation,
    useUpdatedMembersMutation,
    useLikeServerMutation
} = serversApiSlice;