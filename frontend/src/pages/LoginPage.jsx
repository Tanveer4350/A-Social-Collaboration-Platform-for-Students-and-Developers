import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Invalid username/email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uname) => {
    setUsernameOrEmail(uname);
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
            <Code2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to ProjectConnect
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Log in to collaborate on projects, showcase your technical skills, and connect with peers.
          </p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="bg-brand-50/70 border border-brand-200/60 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Quick Demo Accounts (Click to autofill):
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('tanveer')}
              className="px-2 py-1.5 bg-white hover:bg-brand-100 text-slate-800 font-semibold rounded-xl border border-brand-200/60 shadow-xs transition-colors truncate"
            >
              🧑‍💻 Tanveer (Dev)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('simerose')}
              className="px-2 py-1.5 bg-white hover:bg-brand-100 text-slate-800 font-semibold rounded-xl border border-brand-200/60 shadow-xs transition-colors truncate"
            >
              👩‍💻 Simerose (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('harleen')}
              className="px-2 py-1.5 bg-white hover:bg-brand-100 text-slate-800 font-semibold rounded-xl border border-brand-200/60 shadow-xs transition-colors truncate"
            >
              👨‍💻 Harleen (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sarah_ai')}
              className="px-2 py-1.5 bg-white hover:bg-brand-100 text-slate-800 font-semibold rounded-xl border border-brand-200/60 shadow-xs transition-colors truncate"
            >
              🤖 Sarah (AI Dev)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex_dev')}
              className="px-2 py-1.5 bg-white hover:bg-brand-100 text-slate-800 font-semibold rounded-xl border border-brand-200/60 shadow-xs transition-colors truncate col-span-2"
            >
              ☁️ Alex (Senior DevOps)
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="e.g. tanveer or tanveer@thapar.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
