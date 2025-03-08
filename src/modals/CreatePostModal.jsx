import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { useFormik } from 'formik';
import postSchema from '../validations/modalValidation.js';
 
const CreatePostModal = ({ show, onHide, users, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      userId: null,
      comments: [],
    },
    validationSchema: postSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onHide();
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Создание поста</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Заголовок</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.title && !!formik.errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Содержание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="body"
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.body && !!formik.errors.body}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.body}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пользователь</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {formik.values.userId
                  ? users.find((user) => user.id === formik.values.userId).name
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
            {formik.touched.userId && formik.errors.userId && (
              <div className="text-danger">{formik.errors.userId}</div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          Опубликовать пост
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePostModal;
