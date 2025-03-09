import { Routes, Route } from 'react-router-dom';
import MainContent from './pages/MainContent';
import PostDetailed from './pages/PostDetailed';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<MainContent />} />
      <Route path='/post/:postId' element={<PostDetailed />} />
    </Routes>
  );
};

export default AppRouter;
