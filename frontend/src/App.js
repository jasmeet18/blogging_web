import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBlogs from './pages/MyBlogs';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';

import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';  // ✅ Correct import

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/write' element={<CreatePost />} />
        <Route path='/posts/post/:id' element={<PostDetails />} />
        <Route path='/edit/:id' element={<EditPost />} />
        <Route path='/myblogs/:id' element={<MyBlogs />} />
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
