import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import postSchema from '../validations/modalValidation.js';

const EditPostModal = ({ show, onHide, post, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      id: null,
      title: '',
      body: '',
      userId: null,
    },
    validationSchema: postSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onHide();
    },
  });

  useEffect(() => {
    if (post) {
      formik.setValues({
        id: post.id,
        title: post.title,
        body: post.body,
        userId: post.userId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Редактирование поста #{post.id}</Modal.Title>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;