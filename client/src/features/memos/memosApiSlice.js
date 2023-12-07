import { apiSlice } from "../authentication/api/apiSlice";

export const memosApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            getMemo: builder.query({
                query: (friendId) => ({
                    url: `/memos/${friendId}`,
                    transformResponse: (response) => {
                        if (response.status === 404) {
                            return [];
                        }
                        console.log(response);
                        return response;
                    }
                }),
                providesTags: (result, error, arg) => {
                    if (Array.isArray(result) && result.length) {
                        return [
                            { type: 'Memo', id: result._id }
                        ]
                    } else {
                        return [];
                    }
                }
            }),
            addMemo: builder.mutation({
                query: ({friendId, memo}) => ({
                    url: `/memos/${friendId}`,
                    method: 'POST',
                    body: {
                        memo
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Memo', id: result._id }
                ]
            }),
            updateMemo: builder.mutation({
                query: ({friendId, memo}) => ({
                    url: `/memos/${friendId}`,
                    method: 'PUT',
                    body: {
                        memo
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Memo', id: result._id }
                ]
            }),
            deleteMemo: builder.mutation({
                query: (friendId) => ({
                    url: `/memos/${friendId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Memo', id: arg }
                ]
            })
        }
    )
});

export const {
    useAddMemoMutation,
    useUpdateMemoMutation,
    useGetMemoQuery,
    useDeleteMemoMutation
} = memosApiSlice;