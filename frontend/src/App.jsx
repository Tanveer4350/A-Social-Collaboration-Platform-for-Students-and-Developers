import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CreatePostModal from './components/CreatePostModal';
import CreateProjectModal from './components/CreateProjectModal';

// Pages
import FeedPage from './pages/FeedPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ExplorePage from './pages/ExplorePage';
import RecommendationsPage from './pages/RecommendationsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
      />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <FeedPage
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onOpenCreateProject={() => setIsCreateProjectOpen(true)}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsPage
                onOpenCreateProject={() => setIsCreateProjectOpen(true)}
              />
            }
          />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={() => {
          // If on feed, trigger feed refresh
          window.location.reload();
        }}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={() => {
          window.location.href = '/projects';
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
