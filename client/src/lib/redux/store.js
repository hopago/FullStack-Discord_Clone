import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/authentication/api/apiSlice';
import authReducer from '../../features/authentication/slice/authSlice';
import userReducer from '../../features/users/slice/userSlice';
import postReducer from '../../features/post/slice/postsSlice';
import serverReducer from '../../features/server/slice/serversSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        user: userReducer,
        posts: postReducer,
        servers: serverReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});