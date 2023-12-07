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
                            { type: 'BlackList', id: "LIST" },
                            ...result.map(({ _id }) => ({
                                type: "BlackList", id: _id
                            }))
                        ]
                    } else {
                        return []
                    }
                }
            })
        }
    )
});

export const {
    useLazyGetAllBlackListQuery,
    useGetAllBlackListQuery
} = blackListApiSlice;