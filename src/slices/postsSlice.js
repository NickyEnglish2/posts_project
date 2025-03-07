import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('/api/posts');
  return response.data;
});

export const addPost = createAsyncThunk('posts/addPost', async (postData) => {
  const response = await axios.post('/api/posts', postData);
  return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
  await axios.delete(`/api/posts/${postId}`);
  return postId;
});

const initialState = {
  items: [],
  status: 'idle', // idle, loading, success, failure
  error: null, 
};

const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failure';
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      });
  },
});

export default PostsSlice.reducer;
