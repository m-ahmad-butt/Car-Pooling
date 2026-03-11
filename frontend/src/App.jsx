import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'
import ForgotPasswordPage from './pages/forgotPassword'
import FeedPage from './pages/feed'
import ProfilePage from './pages/profile'
import OtherProfilePage from './pages/otherProfile'
import ResetPassword from './components/reset-password'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<OtherProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
