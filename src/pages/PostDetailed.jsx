import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, editPost } from '../slices/postsSlice';
import { fetchUsers } from '../slices/usersSlice';
import { fetchComments, addComment } from '../slices/commentsSlice';
import { Container, Card, Spinner, Button, Form, Dropdown } from 'react-bootstrap';
import { useFormik } from 'formik';
import addCommentValidation from '../validations/addCommentValidation';

const PostDetailed = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const users = useSelector((state) => state.users.items);
  const comments = useSelector((state) => state.comments.items);

  const post = posts.find((p) => p.id === postId);
  const user = post ? users.find((u) => u.id === post.userId) : null;

  const postComments = useMemo(() => {
    return post ? comments.filter((c) => c.postId === postId) : [];
  }, [post, comments, postId]);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts());
    }
    if (!user) {
      dispatch(fetchUsers());
    }
    if (postComments.length === 0) {
      dispatch(fetchComments());
    }
  }, [dispatch, post, user, postComments.length]);

  const formik = useFormik({
    initialValues: {
      body: '',
      userid: null,
    },
    validationSchema: addCommentValidation,
    onSubmit: async (values) => {
      if (!post) return;

      const newComment = {
        postId: post.id,
        userId: values.userId,
        body: values.body,
      };

      const addedComment = await dispatch(addComment(newComment)).unwrap();

      const updatedPost = {
        ...post,
        comments: [...post.comments, addedComment.id],
      };

      await dispatch(editPost(updatedPost));

      formik.resetForm();
    },
  });

  if (!post || !user) {
    return <Spinner animation="border" />;
  }

  return (
    <Container className="mt-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        Назад
      </Button>

      <Card>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Автор поста: {user.name}
          </Card.Subtitle>
          <Card.Text>{post.body}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Комментарии:</h3>
      {postComments.map((comment) => {
        const commentUser = users.find((u) => u.id === comment.userId);
        return (
          <Card key={comment.id} className="mb-3">
            <Card.Body>
              <Card.Title>Комментарий #{comment.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Автор: {commentUser ? commentUser.name : 'Ошибка поиска'}
              </Card.Subtitle>
              <Card.Text>{comment.body}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}

      <Card className="mt-4">
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="body"
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.body && !!formik.errors.body}
                placeholder="Введите ваш комментарий..."
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.body}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Автор комментария:</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {formik.values.userId
                    ? users.find((u) => u.id === formik.values.userId)?.name
                    : 'Выберите пользователя'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {users.map((user) => (
                    <Dropdown.Item
                      key={user.id}
                      onClick={() => formik.setFieldValue('userId', user.id)}
                    >
                      {user.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {formik.touched.userId && formik.errors.userId ? (
                <div className="text-danger">{formik.errors.userId}</div>
              ) : null}
            </Form.Group>
            <Button variant="primary" type="submit">
              Отправить
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetailed;
