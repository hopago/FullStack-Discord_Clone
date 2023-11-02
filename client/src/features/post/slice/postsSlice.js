import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {

    }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostById = (state, postId) =>
    state.posts.posts.find(post => post._id === postId);

export default postsSlice.reducer;