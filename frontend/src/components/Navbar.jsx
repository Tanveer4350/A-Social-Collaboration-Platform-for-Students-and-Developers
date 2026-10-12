import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Code2,
  Home,
  FolderGit2,
  Users,
  Sparkles,
  MessageSquare,
  Search,
  LogOut,
  User as UserIcon,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ onOpenCreatePost, onOpenCreateProject }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-50 text-brand-600 font-semibold shadow-sm shadow-brand-100/50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-brand-800 to-indigo-600 bg-clip-text text-transparent">
                ProjectConnect
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                Students & Devs
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, skills, projects, posts..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Home className="w-4 h-4" />
              Feed
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              <FolderGit2 className="w-4 h-4" />
              Projects
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              <Users className="w-4 h-4" />
              Explore
            </NavLink>
            <NavLink to="/recommendations" className={navLinkClass}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              Matching
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/messages" className={navLinkClass}>
                <MessageSquare className="w-4 h-4" />
                Messages
              </NavLink>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                {/* Create Buttons Dropdown / Modal triggers */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={onOpenCreatePost}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New Post
                  </button>
                  <button
                    onClick={onOpenCreateProject}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/20 rounded-xl transition-all"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    New Project
                  </button>
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={
                        user?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullName || 'User'
                        )}&background=6366f1&color=fff`
                      }
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          @{user?.username}
                        </p>
                      </div>

                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/projects?my=true"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4 text-slate-400" />
                        My Projects
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20 transition-all"
                >
                  Join Platform
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu modal */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 text-sm rounded-xl outline-none"
              />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-sm font-medium"
            >
              <Home className="w-4 h-4 text-brand-600" /> Feed
            </NavLink>
            <NavLink
              to="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-sm font-medium"
            >
              <FolderGit2 className="w-4 h-4 text-brand-600" /> Projects
            </NavLink>
            <NavLink
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-sm font-medium"
            >
              <Users className="w-4 h-4 text-brand-600" /> Explore
            </NavLink>
            <NavLink
              to="/recommendations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Matching
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
