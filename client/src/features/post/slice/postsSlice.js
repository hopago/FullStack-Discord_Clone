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
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload);
            },
            prepare(file, title, description, category, userId) {
                return {
                    payload: {
                        file,
                        title,
                        description,
                        category,
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find(post => post._id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    },
    extraReducers(builder) {

    }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post._id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;