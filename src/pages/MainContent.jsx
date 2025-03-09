import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Row, Col, Pagination, Dropdown, Spinner, Card, Button } from 'react-bootstrap';
import { fetchPosts, addPost, deletePost, editPost } from '../slices/postsSlice';
import { fetchUsers } from '../slices/usersSlice';
import { fetchComments, deleteComments } from '../slices/commentsSlice';
import { Link } from 'react-router-dom';
import CreatePostModal from '../modals/CreatePostModal.jsx';
import EditPostModal from '../modals/EditPostModal.jsx';

const MainContent = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  const users = useSelector((state) => state.users.items);
  const usersStatus = useSelector((state) => state.users.status);
  const usersError = useSelector((state) => state.users.error);

  // const comments = useSelector((state) => state.comments.items);
  const commentsStatus = useSelector((state) => state.comments.status);
  const commentsError = useSelector((state) => state.comments.error);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts());
    }
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
    if (commentsStatus === 'idle') {
      dispatch(fetchComments());
    }
  }, [postsStatus, usersStatus, commentsStatus, dispatch]);

  const usersMap = users.reduce((map, user) => {
    map[user.id] = user.name;
    return map;
  }, {});

  const filterPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesUser = selectedUserId ? post.userId === selectedUserId : true;
    return matchesSearch && matchesUser;
  });

  const indexofLastPost = currentPage * postsPerPage;
  const indexofFirstPost = indexofLastPost - postsPerPage;
  const currentPosts = filterPosts.slice(indexofFirstPost, indexofLastPost);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filterPosts.length / postsPerPage); i += 1) {
    pageNumbers.push(i);
  }

  const handlePageSwap = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const EditModalShow = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUserId]);

  const handlePostCreate = (postData) => {
    dispatch(addPost(postData));
  };

  const handlePostEdit = (postData) => {
    dispatch(editPost(postData));
  };

  const handlePostDelete = async (post) => {
    await post.comments.forEach((comment) => dispatch(deleteComments(comment)));
    await dispatch(deletePost(post.id));

    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchComments())
  };

  const cutText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  let content;

  if (postsStatus === 'loading' || usersStatus === 'loading' || commentsStatus === 'loading') {
    content = <Spinner animation="border" />;
  } else if (postsStatus === 'success' && usersStatus === 'success' && commentsStatus === 'success') {
    content = (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Искать по названию поста..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedUserId ? usersMap[selectedUserId] : 'Поиск по пользователю'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedUserId(null)}>
                  Все пользователи
                </Dropdown.Item>
                {users.map((user) => (
                  <Dropdown.Item
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    {user.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          {currentPosts.map((post) => (
            <Col key={post.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Автор: {usersMap[post.userId]}
                  </Card.Subtitle>
                  <Card.Text>{cutText(post.body, 35)}</Card.Text>
                  <Button variant="danger" onClick={() => handlePostDelete(post)}>
                    Удалить пост
                  </Button>
                  <Button variant="warning" onClick={() => EditModalShow(post)}>
                    Отредактировать
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col>
            <Pagination>
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => handlePageSwap(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      </>
    );
  } else if (postsStatus === 'failure' || usersStatus === 'failure' || commentsStatus === 'failure') {
    content = <div>Произошла ошибка: {postsError || usersError || commentsError}</div>
  }

  return (
    <Container className="mt-4">
      <h1>Список постов</h1>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Создать пост
      </Button>
      {content}
      <CreatePostModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        users={users}
        onSubmit={handlePostCreate}
      />
      <EditPostModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        post={selectedPost}
        onSubmit={handlePostEdit}
      />
    </Container>
  );
};

export default MainContent;
