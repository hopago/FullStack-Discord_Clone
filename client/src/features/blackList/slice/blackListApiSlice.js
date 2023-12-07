import { apiSlice } from "../../authentication/api/apiSlice";

export const blackListApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getAllBlackList: builder.query({
                query: () => ({
                    url: 'blackList',
                    transformResponse: (res) => {
                        if (res.status === 400) {
                            return [];
                        }

                        return res;
                    }
                }),
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            { type: 'BlackList', id: result._id },
                            ...result.members.map(({ _id }) => ({
                                type: "BlackListMember", id: _id
                            }))
                        ]
                    } else {
                        return []
                    }
                }
            }),
            addBlackList: builder.mutation({
                query: userId => ({
                    url: `/blackList/${userId}`,
                    method: 'POST',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "BlackList", id: result._id },
                    { type: "BlackListMember", id: arg }
                ]
            }),
            deleteBlackList: builder.mutation({
                query: userId => ({
                    url: `/blackList/${userId}`,
                    method: "DELETE"
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: "BlackList", id: result._id },
                    { type: "BlackListMember", id: arg }
                ]
            })
        }
    )
});

export const {
    useLazyGetAllBlackListQuery,
    useGetAllBlackListQuery,
    useAddBlackListMutation,
    useDeleteBlackListMutation
} = blackListApiSlice;