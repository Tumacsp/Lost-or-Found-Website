import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import Layout from './components/ui/admin/layout';
import NotFoundPage from "./pages/404_notfound";
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
import DashboardPage from './pages/admin/dashboard';
import UsersPage from './pages/admin/user_page';
import PostsPage from './pages/admin/post_page';
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

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Lost or Found",
      "/search": "Search | Lost or Found",
      "/login": "Login | Lost or Found",
      "/signup": "Sign Up | Lost or Found",
      "/forgot-password": "Forgot Password | Lost or Found",
      "/verify-token": "Verify Token | Lost or Found",
      "/profile": "Profile | Lost or Found",
      "/report": "Report | Lost or Found",
      "/bookmark": "Bookmarks | Lost or Found",
      "/admin-dashboard": "Admin Dashboard | Lost or Found",
      "/admin-dashboard/users": "Manage Users | Lost or Found",
      "/admin-dashboard/posts": "Manage Posts | Lost or Found",
    };

    let title = titles[location.pathname] || "404 Not Found | Lost or Found";

    if (location.pathname.startsWith("/postdetail/")) {
      title = "Post Detail | MyApp";
    } else if (location.pathname.startsWith("/reset-password/")) {
      title = "Reset Password | MyApp";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <PageTitleUpdater />
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
        {/* dashbaord */}
        <Route path="/admin-dashboard" element={<ProtectedRoute> <Layout> <DashboardPage /> </Layout> </ProtectedRoute>} />
        <Route path="/admin-dashboard/users" element={<ProtectedRoute> <Layout> <UsersPage /> </Layout> </ProtectedRoute>} />
        <Route path="/admin-dashboard/posts" element={<ProtectedRoute> <Layout> <PostsPage /> </Layout> </ProtectedRoute>} />
        {/* another path not foundable in website */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
