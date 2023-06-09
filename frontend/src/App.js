import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Header/Header';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';
import NewPost from './Components/NewPost/NewPost';
import Register from './Components/Register/Register';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Search from './Components/Search/Search';
import NotFound from './Components/NotFound/NotFound';
import ChatPage from './Components/ChatPage/ChatPage';
import Account1 from './Components/Account/Account1';
import UserProfile1 from './Components/UserProfile/UserProfile1';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch])

  const { isAuthenticated } = useSelector((state) => state.user)

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <Login />} />
        <Route path='/register' element={isAuthenticated ? <Account /> : <Register />} />
        {/* <Route path='/account' element={isAuthenticated ? <Account /> : <Login />} /> */}
        <Route path='/account' element={isAuthenticated ? <Account1 /> : <Login />} />
        <Route path='/newpost' element={isAuthenticated ? <NewPost /> : <Login />} />
        <Route path='/update/profile' element={isAuthenticated ? <UpdateProfile /> : <Login />} />
        <Route path='/update/password' element={isAuthenticated ? <UpdatePassword /> : <Login />} />
        <Route path='/forgot/password' element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />} />
        <Route path='/password/reset/:token' element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />} />
        {/* <Route path='/user/:id' element={isAuthenticated ? <UserProfile /> : <Login />} /> */}
        <Route path='/user/:id' element={isAuthenticated ? <UserProfile1 /> : <Login />} />
        <Route path='/search' element={isAuthenticated ? <Search /> : <Login />} />
        <Route path='/message' element={isAuthenticated ? <ChatPage /> : <Login />} />
        <Route path='*' element={isAuthenticated ? <NotFound /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
