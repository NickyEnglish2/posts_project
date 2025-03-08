import * as Yup from 'yup';

export default Yup.object().shape({
  title: Yup.string()
    .min(6, 'Не менее 6 символов')
    .max(50, 'Не более 50 символов')
    .required('Строка не должна быть пустой'),
  body: Yup.string()
    .min(10, 'Не менее 10 символов')
    .max(150, 'Не более 150 символов')
    .required('Текст не должен быть пустым'),
  userId: Yup.number()
    .required('Пожалуйста выберите пользователя'),
});
