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
import serverReducer from '../../features/server/slice/serversSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    servers: serverReducer
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