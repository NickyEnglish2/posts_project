import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import usersReducer from './usersSlice.js';

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});