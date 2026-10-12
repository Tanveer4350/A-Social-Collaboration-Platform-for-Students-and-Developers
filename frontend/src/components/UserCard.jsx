import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck, MessageSquare } from 'lucide-react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UserCard({ user, onFollowToggled }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(user.followedByCurrentUser || false);
  const [loading, setLoading] = useState(false);

  const isSelf = currentUser && currentUser.id === user.id;

  const handleFollow = async () => {
    if (!isAuthenticated || isSelf || loading) return;
    try {
      setLoading(true);
      const res = await userService.toggleFollow(user.id);
      setIsFollowing(res.data.following);
      if (onFollowToggled) onFollowToggled(user.id, res.data.following);
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || 'User'
                )}&background=6366f1&color=fff`
              }
              alt={user.fullName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                {user.fullName}
              </h4>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </Link>

          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              user.role === 'ROLE_DEVELOPER'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}
          >
            {user.role === 'ROLE_DEVELOPER' ? 'Developer' : 'Student'}
          </span>
        </div>

        {user.headline && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {user.headline}
          </p>
        )}

        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Array.from(user.skills).slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                +{user.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/profile/${user.username}`}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          View Profile
        </Link>

        {isAuthenticated && !isSelf && (
          <div className="flex items-center gap-1.5">
            <Link
              to={`/messages?user=${user.id}`}
              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-xl"
              title="Message"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            <button
              onClick={handleFollow}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> Follow
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
