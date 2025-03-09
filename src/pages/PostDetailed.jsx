import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../slices/postsSlice';
import { fetchUsers } from '../slices/usersSlice';
import { fetchComments } from '../slices/commentsSlice';
import { Container, Card, Spinner, Button } from 'react-bootstrap';

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
    </Container>
  );
};

export default PostDetailed;
