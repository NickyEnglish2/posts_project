import * as Yup from 'yup';

export default Yup.object().shape({
  body: Yup.string()
    .min(10, 'Не менее 10 символов')
    .max(100, 'Не более 100 символов')
    .required('Комментарий не должен быть пустым'),
  userId: Yup.number()
    .required('Пожалуйста, выберите автора'),
});