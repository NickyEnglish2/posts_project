import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, describe, beforeEach } from 'vitest';
import MainContent from '../pages/MainContent';
import postsReducer from '../slices/postsSlice';
import usersReducer from '../slices/usersSlice';
import commentsReducer from '../slices/commentsSlice';
import { testData } from '../__fixtures__/testData';

const createTestStore = () => {
  return configureStore({
    reducer: {
      posts: postsReducer,
      users: usersReducer,
      comments: commentsReducer,
    },
    preloadedState: {
      posts: {
        items: testData.posts,
        status: 'success',
        error: null,
      },
      users: {
        items: testData.users,
        status: 'success',
        error: null,
      },
      comments: {
        items: testData.comments,
        status: 'success',
        error: null,
      },
    },
  });
};

describe('MainContent', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  test('Успешный рендеринг страницы с постами', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainContent />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('First Post by User 1')).toBeInTheDocument();
    expect(screen.getByText('Second Post by User 2')).toBeInTheDocument();
  });

  test('Фильтрация постов по заголовку поста', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainContent />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Искать по названию поста...');
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First Post by User 1')).toBeInTheDocument();
    expect(screen.queryByText('Second Post by User 2')).not.toBeInTheDocument();
  });
});