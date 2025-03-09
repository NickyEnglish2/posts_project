import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { deletePost } from './postsSlice.js';

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
  const response = await axios.get('/api/comments');
  return response.data;
});

export const addComment = createAsyncThunk('comments/addComment', async (commentData) => {
  const response = await axios.post('/api/comments', commentData);
  return response.data;
});

export const deleteComments = createAsyncThunk('comments/deleteComments', async (commentId) => {
  await axios.delete(`/api/comments/${commentId}`);
  return commentId;
});

const initialState = {
  items: [],
  status: 'idle', // idle, loading, success, failure
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failure';
        state.error = action.error.message;
      })
      .addCase(addComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = 'success';
        state.items.push(action.payload);
      })
      .addCase(deleteComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteComments.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = state.items.filter((comment) => comment.postId !== action.payload);
      })
      .addCase(deleteComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((comment) => comment.postId !== action.payload);
      });
  },
});

export default commentsSlice.reducer;
