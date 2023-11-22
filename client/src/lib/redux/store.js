import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/authentication/api/apiSlice';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../../features/authentication/slice/authSlice';
import userReducer from '../../features/users/slice/userSlice';
import conversationReducer from '../../features/conversation/slice/conversationsSlice';
import { postsApiSlice } from '../../features/post/slice/postsApiSlice';
import { usersApiSlice } from '../../features/users/slice/usersApiSlice';
import { commentsApiSlice } from '../../features/comments/slice/commentsApiSlice';
import { serversApiSlice } from '../../features/server/slice/serversApiSlice';
import { conversationsApiSlice } from '../../features/conversation/slice/conversationsApiSlice';
import { friendRequestApiSlice } from '../../features/friends/slice/friendRequestApiSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blackList: [postsApiSlice.reducerPath, usersApiSlice.reducerPath, commentsApiSlice.reducerPath, serversApiSlice.reducerPath, conversationsApiSlice.reducerPath, friendRequestApiSlice.reducerPath],
};

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    [postsApiSlice.reducerPath]: postsApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [commentsApiSlice.reducerPath]: commentsApiSlice.reducer,
    [serversApiSlice.reducerPath]: serversApiSlice.reducer,
    [conversationsApiSlice.reducerPath]: conversationsApiSlice.reducer,
    [friendRequestApiSlice.reducerPath]: friendRequestApiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    conversation: conversationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE]
            }
        }).concat(apiSlice.middleware),
    devTools: true
});

export const persistor = persistStore(store);

export default store;