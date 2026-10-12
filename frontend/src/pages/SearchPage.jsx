import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, FolderGit2, MessageSquare, Code } from 'lucide-react';
import { discoveryService } from '../services/api';
import UserCard from '../components/UserCard';
import ProjectCard from '../components/ProjectCard';
import PostCard from '../components/PostCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ users: [], projects: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'projects', 'posts'

  useEffect(() => {
    const doSearch = async () => {
      if (!query.trim()) {
        setResults({ users: [], projects: [], posts: [] });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await discoveryService.search(query.trim());
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  const totalResults =
    (results.users?.length || 0) +
    (results.projects?.length || 0) +
    (results.posts?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <Search className="w-4 h-4 text-brand-600" /> Search Results
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Showing results for <span className="text-brand-600">"{query}"</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found {totalResults} matches across developers, projects, and discussions.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'users'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Users ({results.users?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'projects'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Projects ({results.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'posts'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Posts ({results.posts?.length || 0})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Searching platform database...
        </div>
      ) : totalResults === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No matches found for "{query}". Try a different keyword or skill tag.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Users Matches */}
          {(activeTab === 'all' || activeTab === 'users') && results.users?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" /> Users ({results.users.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.users.map((u) => (
                  <UserCard key={u.id} user={u} />
                ))}
              </div>
            </div>
          )}

          {/* Projects Matches */}
          {(activeTab === 'all' || activeTab === 'projects') && results.projects?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-brand-600" /> Projects ({results.projects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* Posts Matches */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts?.length > 0 && (
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-brand-600" /> Technical Posts ({results.posts.length})
              </h2>
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
