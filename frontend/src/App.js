import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main_page';
import LoginPage from './pages/auth/login_page';
import SignupPage from './pages/auth/signup_page';
import ForgotPasswordPage from './pages/auth/forgot_password_page';
import VerifyTokenPage  from './pages/auth/verify_token_page';
import ResetPasswordPage from './pages/auth/reset_password_page';
import ProfilePage from './pages/profile_page';
import ReportPage from './pages/report/page';
import SearchPage from './pages/search/page';
import PostDetailPage from './pages/postdetail_page';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-token" element={<VerifyTokenPage  />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/report" element={<ReportPage/>} />
        <Route path="/search" element={<SearchPage/>} />
        <Route path="/postdetail/:id" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
