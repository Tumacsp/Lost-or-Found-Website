import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import MainPage from "./pages/main_page";
import LoginPage from "./pages/auth/login_page";
import SignupPage from "./pages/auth/signup_page";
import ForgotPasswordPage from "./pages/auth/forgot_password_page";
import VerifyTokenPage from "./pages/auth/verify_token_page";
import ResetPasswordPage from "./pages/auth/reset_password_page";
import ProfilePage from "./pages/profile_page";
import ReportPage from "./pages/report/page";
import SearchPage from "./pages/search/page";
import PostDetailPage from "./pages/postdetail/postdetail_page";
import Bookmark from "./pages/bookmark/page";
import { isAuthenticated } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/postdetail/:id" element={<PostDetailPage />} />
        {/* public only no authen can get in */}
        <Route path="/login" element={<PublicOnlyRoute> <LoginPage /> </PublicOnlyRoute>}/>
        <Route path="/signup" element={<PublicOnlyRoute> <SignupPage /> </PublicOnlyRoute>}/>
        <Route path="/forgot-password" element={<PublicOnlyRoute> <ForgotPasswordPage /> </PublicOnlyRoute>} />
        <Route path="/verify-token" element={<PublicOnlyRoute> <VerifyTokenPage /> </PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute> <ResetPasswordPage /> </PublicOnlyRoute>} />
        {/* authen only no public can get in */}
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute> <ReportPage /> </ProtectedRoute>} />
        <Route path="/bookmark" element={<ProtectedRoute> <Bookmark /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
