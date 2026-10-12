import React, { useState, useEffect } from 'react';
import { Users, Search, Sparkles, Filter, Code } from 'lucide-react';
import { userService } from '../services/api';
import UserCard from '../components/UserCard';

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const skillsList = [
    'Java',
    'Spring Boot',
    'React',
    'TypeScript',
    'Python',
    'Docker',
    'Tailwind CSS',
    'PostgreSQL',
    'MySQL',
    'AI',
    'Machine Learning',
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedSkill) {
        res = await userService.getUsersBySkill(selectedSkill);
      } else {
        res = await userService.getAllUsers();
      }
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedSkill]);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.headline?.toLowerCase().includes(q) ||
      (u.skills && Array.from(u.skills).some((s) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Developer & Student Network
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover students, software engineers, and collaborators across technologies and domains.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, or role..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Skill Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-6 mt-6 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Skill:
          </span>
          <button
            onClick={() => setSelectedSkill('')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              !selectedSkill
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                selectedSkill === skill
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-3 h-48"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-3 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No developers found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your skill filter or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
