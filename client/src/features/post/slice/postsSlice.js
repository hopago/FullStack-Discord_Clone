import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from '../../../services/requestMethods';

const initialState = {
    posts: [],
    status: 'idle',
    error: null
};

export const fetchPosts = createAsyncThunk('posts/latest', async () => {
    try {
        const res = await apiCall.get("/posts/latest");
        return res.data;
    } catch (error) {
        return error.message;
    }
});

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
        builder
          .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading';
          })
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';

            const loadedPosts = action.payload.map(post => {
                post.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                return post;
            });

            state.posts = state.posts.concat(loadedPosts);
          })
          .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
    }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;