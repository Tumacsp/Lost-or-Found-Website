import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main_page';
import LoginPage from './pages/auth/login_page';
import SignupPage from './pages/auth/signup_page';
import ForgotPasswordPage from './pages/auth/forgot_password_page';
import VerifyTokenPage  from './pages/auth/verify_token_page';
import ResetPasswordPage from './pages/auth/reset_password_page';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-token" element={<VerifyTokenPage  />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
