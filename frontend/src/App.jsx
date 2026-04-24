import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing'
import BrowsePage from './pages/browse'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'
import ForgotPasswordPage from './pages/forgotPassword'
import FeedPage from './pages/feed'
import ProfilePage from './pages/profile'
import OtherProfilePage from './pages/otherProfile'
import ResetPassword from './components/reset-password'
import ProtectedRoute from './components/protectedRoute'
import UserSync from './components/userSync'

function App() {
  return (
    <BrowserRouter>
      <UserSync />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><OtherProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
