import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, authLogout } from '../slice/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers;
    },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    const isPersisted = JSON.parse(localStorage.getItem("persist"));

    if (result?.error?.originalStatus === 403) {
        if (!isPersisted) return api.dispatch(authLogout());

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            api.dispatch(setCredentials({ ...refreshResult.data, user }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(authLogout());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Post', 'User', 'Server', 'Comment', 'FriendRequest', 'Conversation', 'Memo', 'BlackList', 'FriendRequestMember', 'BlackListMember', 'Notification', 'Private_Messages'],
    endpoints: builder => ({

    }),
});