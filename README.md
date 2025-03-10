# Posts Project

React приложение для загрузки постов, их создания, редактирования и удаления.

## Установка

После клонирования git репозитория, введите команду `make install` для установки зависимостей.

## Тестирование

Для запуска Vitest введите команду `make test`.

## Запуск

Для запуска приложения введите команду `make start` и затем нажмите `o` для выведения страницы в браузере. Или можете ввести IP: [http://localhost:5173/](http://localhost:5173/).

Чтобы завершить процесс, нажмите хоткей: `Ctrl + C`.

## Описание слоев

- **data**: содержит базу данных для фреймворка `json-server`.
- **src**: основная папка кода.

### Внутри `src`:

1. **`__fixtures__` и `__tests__`**: папки, хранящие фикстуру для тестов и файл тестирования. Вместо Jest использован фреймворк Vitest.
2. **`modals`**: папка, хранящая модальные окна для создания и редактирования постов.
3. **`pages`**: папка, хранящая React страницы для списка постов и для детальной демонстрации поста с его комментариями.
4. **`slices`**: папка, хранящая слайсы для постов, комментариев и пользователей и `store`, объединяющий их.
5. **`styles`**: папка, хранящая файл стилей `scss`. Необходима для импорта Bootstrap.
6. **`validations`**: Папка, содержащая схемы валидации. Был использован фреймворк Yup.
7. **`AppRouter`**: файл роутер.
8. **`App.jsx`**: файл, обворачивающий роутер в функцию.
9. **`main.jsx`**: Главный файл, инициализирующий рендер сайта.
10. **`setupTests.js`**: файл конфигурации для Vitest.