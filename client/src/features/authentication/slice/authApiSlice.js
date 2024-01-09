import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => (
        {
            login: builder.mutation({
                query: credentials => ({
                    url: '/auth/login',
                    method: 'POST',
                    body: { ...credentials }
                })
            }),
            logOut: builder.mutation(
                {
                    query: () => ({
                        url: '/auth/logout',
                        method: 'POST',
                    }),
                }),
            register: builder.mutation({
                query: credentials => ({
                    url: '/auth/register',
                    method: 'POST',
                    body: { ...credentials }
                })
            })
        }
    )
});

export const {
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation
} = authApiSlice;