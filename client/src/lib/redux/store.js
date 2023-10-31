import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/authentication/api/apiSlice';
import authReducer from '../../features/authentication/slice/authSlice';
import userReducer from '../../features/users/slice/userSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        user: userReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});