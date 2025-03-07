import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Row, Col, Pagination, Dropdown, Spinner, Card } from 'react-bootstrap';
import { fetchPosts } from '../slices/postsSlice';
import { fetchUsers } from '../slices/usersSlice';

const MainContent = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  const users = useSelector((state) => state.users.items);
  const usersStatus = useSelector((state) => state.users.status);
  const usersError = useSelector((state) => state.users.error);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts());
    }
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [postsStatus, usersStatus, dispatch]);

  const usersMap = users.reduce((map, user) => {
    map[user.id] = user.name;
    return map;
  }, {});

  const filterPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesUser = selectedUserId ? post.userId === Number(selectedUserId) : true;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUserId]);

  let content;

  if (postsStatus === 'loading' || usersStatus === 'loading') {
    content = <Spinner animation="border" />;
  } else if (postsStatus === 'success' && usersStatus === 'success') {
    content = (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Искать по названию поста"
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
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Автор: {usersMap[post.userId]}
                  </Card.Subtitle>
                  <Card.Text>{post.body}</Card.Text>
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
  } else if (postsStatus === 'failure' || usersStatus === 'failure') {
    content = <div>Произошла ошибка: {postsError || usersError}</div>
  }

  return (
    <Container className="mt-4">
      <h1>Список постов</h1>
      {content}
    </Container>
  );
};

export default MainContent;
