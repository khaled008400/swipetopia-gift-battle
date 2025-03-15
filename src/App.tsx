import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import VideosPage from './pages/VideosPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import VideoPlayerPage from './pages/VideoPlayerPage';

function App() {
  return (
    <div className="App flex flex-col min-h-screen bg-app-black text-white">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/video/:videoId" element={<VideoPlayerPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
