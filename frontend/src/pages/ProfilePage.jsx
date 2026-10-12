import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  UserPlus,
  UserCheck,
  MessageSquare,
  Edit,
  FolderGit2,
  Code,
  Heart,
  X,
  Plus
} from 'lucide-react';
import { userService, postService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import ProjectCard from '../components/ProjectCard';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'projects', 'joined', 'followers', 'following'
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    headline: '',
    bio: '',
    education: '',
    avatarUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });
  const [editSkills, setEditSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [editInterests, setEditInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile(username);
      setProfile(res.data);
      setIsFollowing(res.data.isFollowedByCurrentUser);

      // Populate edit form
      setEditForm({
        fullName: res.data.fullName || '',
        headline: res.data.headline || '',
        bio: res.data.bio || '',
        education: res.data.education || '',
        avatarUrl: res.data.avatarUrl || '',
        githubUrl: res.data.githubUrl || '',
        linkedinUrl: res.data.linkedinUrl || '',
        portfolioUrl: res.data.portfolioUrl || '',
      });
      setEditSkills(res.data.skills ? Array.from(res.data.skills) : []);
      setEditInterests(res.data.interests ? Array.from(res.data.interests) : []);

      // Load sub-resources
      const [pRes, projRes, joinRes, fRes, fingRes] = await Promise.all([
        postService.getUserPosts(username),
        projectService.getUserProjects(username),
        projectService.getUserJoinedProjects(username),
        userService.getFollowers(res.data.id),
        userService.getFollowing(res.data.id),
      ]);

      setPosts(pRes.data);
      setCreatedProjects(projRes.data);
      setJoinedProjects(joinRes.data);
      setFollowers(fRes.data);
      setFollowing(fingRes.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username, isAuthenticated]);

  const handleToggleFollow = async () => {
    if (!profile || !isAuthenticated) return;
    try {
      const res = await userService.toggleFollow(profile.id);
      setIsFollowing(res.data.following);
      setProfile((prev) => ({
        ...prev,
        followersCount: res.data.following
          ? prev.followersCount + 1
          : Math.max(0, prev.followersCount - 1),
      }));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userService.updateProfile({
        ...editForm,
        skills: editSkills,
        interests: editInterests,
      });
      setProfile(res.data);
      setShowEditModal(false);
      refreshUser();
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading technical profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-base font-bold text-slate-900">User Not Found</h2>
      </div>
    );
  }

  const isSelf = profile.isSelf;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 relative" />

        <div className="px-6 sm:px-8 pb-8">
          {/* Avatar and Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="relative">
              <img
                src={
                  profile.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.fullName
                  )}&background=6366f1&color=fff`
                }
                alt={profile.fullName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isSelf ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : isAuthenticated ? (
                <>
                  <Link
                    to={`/messages?user=${profile.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </Link>
                  <button
                    onClick={handleToggleFollow}
                    className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20'
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
                </>
              ) : null}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {profile.fullName}
                </h1>
                <span
                  className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                    profile.role === 'ROLE_DEVELOPER'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {profile.role === 'ROLE_DEVELOPER' ? 'Developer' : 'Student'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">@{profile.username}</p>
            </div>

            {profile.headline && (
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {profile.headline}
              </p>
            )}

            {profile.bio && (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-w-3xl">
                {profile.bio}
              </p>
            )}

            {/* Education */}
            {profile.education && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{profile.education}</span>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-medium"
                >
                  <Globe className="w-4 h-4" /> Portfolio
                </a>
              )}
            </div>

            {/* Skills & Interests Tags */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills & Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(profile.skills).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/50 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Interests & Domains
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(profile.interests).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 sm:px-8 border-t border-slate-200 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Created Projects ({createdProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'joined'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Joined Projects ({joinedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'followers'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Followers ({profile.followersCount})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'following'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Following ({profile.followingCount})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'posts' && (
        <div className="space-y-4 max-w-3xl">
          {posts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No technical posts published yet.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={(pid) => setPosts(posts.filter((p) => p.id !== pid))}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {createdProjects.length === 0 ? (
            <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No projects created yet.
            </div>
          ) : (
            createdProjects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      )}

      {activeTab === 'joined' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {joinedProjects.length === 0 ? (
            <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Has not joined any external project teams yet.
            </div>
          ) : (
            joinedProjects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      )}

      {activeTab === 'followers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {followers.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No followers yet.
            </div>
          ) : (
            followers.map((f) => (
              <Link
                key={f.id}
                to={`/profile/${f.username}`}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 flex items-center gap-3 transition-all"
              >
                <img
                  src={
                    f.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      f.fullName
                    )}&background=6366f1&color=fff`
                  }
                  alt={f.fullName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{f.fullName}</h4>
                  <p className="text-[11px] text-slate-400">@{f.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === 'following' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {following.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Not following anyone yet.
            </div>
          ) : (
            following.map((f) => (
              <Link
                key={f.id}
                to={`/profile/${f.username}`}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 flex items-center gap-3 transition-all"
              >
                <img
                  src={
                    f.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      f.fullName
                    )}&background=6366f1&color=fff`
                  }
                  alt={f.fullName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{f.fullName}</h4>
                  <p className="text-[11px] text-slate-400">@{f.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Update Technical Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editForm.headline}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  placeholder="e.g. Backend Architect | Distributed Systems Enthusiast"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Biography & Background
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell others about your experience, domains of interest, and goals..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Education / University
                </label>
                <input
                  type="text"
                  value={editForm.education}
                  onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                  placeholder="e.g. Thapar Institute of Engineering & Technology (BE CSE 3rd Year)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              {/* Skills Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Skills & Technologies
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-lg border border-brand-200"
                    >
                      {s}
                      <button type="button" onClick={() => setEditSkills(editSkills.filter((x) => x !== s))}>
                        <X className="w-3 h-3 hover:text-rose-500" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                      e.preventDefault();
                      const val = skillInput.trim().replace(/,/g, '');
                      if (!editSkills.includes(val)) setEditSkills([...editSkills, val]);
                      setSkillInput('');
                    }
                  }}
                  placeholder="Add skill (e.g. Spring Boot, Java, React) - press Enter"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editForm.githubUrl}
                    onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editForm.linkedinUrl}
                    onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
