import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Users,
  Compass,
  Tag,
  PlusCircle,
  FolderGit2,
  TrendingUp,
  ArrowRight,
  Code
} from 'lucide-react';
import { postService, projectService, discoveryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function FeedPage({ onOpenCreatePost, onOpenCreateProject }) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'following', 'trending', 'tag'
  const [selectedTag, setSelectedTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProjects, setTopProjects] = useState([]);
  const [recommendations, setRecommendations] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedTag) {
        res = await postService.getPostsByTag(selectedTag);
      } else if (activeTab === 'following' && isAuthenticated) {
        res = await postService.getFeed();
      } else if (activeTab === 'trending') {
        res = await postService.getTrending();
      } else {
        res = await postService.getAllPosts();
      }
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarData = async () => {
    try {
      const [projRes, recRes] = await Promise.all([
        projectService.getAllProjects('OPEN', null),
        isAuthenticated ? discoveryService.getRecommendations() : Promise.resolve({ data: null }),
      ]);
      setTopProjects(projRes.data.slice(0, 3));
      if (recRes.data) setRecommendations(recRes.data);
    } catch (err) {
      console.error('Sidebar load error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab, selectedTag]);

  useEffect(() => {
    fetchSidebarData();
  }, [isAuthenticated]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setActiveTab('tag');
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column */}
        <main className="lg:col-span-8 space-y-6">
          {/* Post Creation Banner */}
          {isAuthenticated && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || 'User'
                    )}&background=6366f1&color=fff`
                  }
                  alt={user?.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <button
                  onClick={onOpenCreatePost}
                  className="flex-1 text-left px-4 py-2.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-colors font-medium"
                >
                  Share an engineering breakthrough, code snippet, or insight...
                </button>
                <button
                  onClick={onOpenCreatePost}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Post
                </button>
              </div>
            </div>
          )}

          {/* Feed Filter Tabs */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setActiveTab('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> All Feed
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setActiveTab('following');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'following'
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Following
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedTag(null);
                  setActiveTab('trending');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'trending'
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending
              </button>

              {selectedTag && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200">
                  <Tag className="w-3 h-3" /> #{selectedTag}
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setActiveTab('all');
                    }}
                    className="hover:text-rose-500 ml-1 text-slate-400"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Posts Feed Stream */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="w-32 h-3.5 bg-slate-200 rounded" />
                      <div className="w-24 h-2.5 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-200 rounded" />
                    <div className="w-5/6 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
              <Code className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No posts found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Be the first to share a coding experience or ask questions to fellow students and developers!
              </p>
              {isAuthenticated && (
                <button
                  onClick={onOpenCreatePost}
                  className="mt-4 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={handlePostDeleted}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar Column */}
        <aside className="lg:col-span-4 space-y-6 hidden lg:block">
          {/* Welcome Card for Guests */}
          {!isAuthenticated && (
            <div className="bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/20">
              <h3 className="font-bold text-base mb-1.5">Join ProjectConnect</h3>
              <p className="text-xs text-brand-100 leading-relaxed mb-4">
                Connect with students and developers, showcase your tech stack, and find teammates for your next big project.
              </p>
              <div className="flex gap-2.5">
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2 text-xs font-bold bg-white text-brand-700 hover:bg-brand-50 rounded-xl shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold bg-brand-700/60 hover:bg-brand-700 text-white rounded-xl"
                >
                  Log In
                </Link>
              </div>
            </div>
          )}

          {/* Smart Collaborator Matching Preview */}
          {isAuthenticated && recommendations?.recommendedCollaborators?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Matched Collaborators</h4>
                </div>
                <Link
                  to="/recommendations"
                  className="text-[11px] font-bold text-brand-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recommendations.recommendedCollaborators.slice(0, 3).map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <Link
                      to={`/profile/${match.user.username}`}
                      className="flex items-center gap-2.5 min-w-0"
                    >
                      <img
                        src={
                          match.user.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            match.user.fullName
                          )}&background=6366f1&color=fff`
                        }
                        alt={match.user.fullName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {match.user.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {match.user.headline || `@${match.user.username}`}
                        </p>
                      </div>
                    </Link>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full flex-shrink-0">
                      {match.matchScorePercentage}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Collaboration Projects */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Open Projects</h4>
              </div>
              <Link
                to="/projects"
                className="text-[11px] font-bold text-brand-600 hover:underline"
              >
                Browse All
              </Link>
            </div>

            <div className="space-y-3">
              {topProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="block p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-slate-900 text-xs group-hover:text-brand-600 transition-colors line-clamp-1">
                      {p.title}
                    </h5>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Open
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <button
                onClick={onOpenCreateProject}
                className="mt-4 w-full py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Create a Project
              </button>
            )}
          </div>

          {/* Popular Topics / Tags */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <h4 className="font-bold text-slate-900 text-sm">Popular Tags</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'SpringBoot',
                'React',
                'Java',
                'FullStack',
                'AI',
                'SystemDesign',
                'WebSocket',
                'UIUX',
                'Docker',
                'PostgreSQL',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent rounded-xl transition-all"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
