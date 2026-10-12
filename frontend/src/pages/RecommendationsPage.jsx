import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  Users,
  FolderGit2,
  Send,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { discoveryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationModal from '../components/ApplicationModal';

export default function RecommendationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectForApp, setSelectedProjectForApp] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await discoveryService.getRecommendations();
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [isAuthenticated]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-brand-900 to-purple-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Skill-Based Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Smart Recommendations for You
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our recommendation algorithm cross-analyzes your declared skill profile ({user?.skills ? Array.from(user.skills).join(', ') : 'Add skills in your profile to boost precision'}) against project requirements and developer skillsets to compute synergy scores.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Analyzing skill synergy and computing scores...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Recommended Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-brand-600" />
                  Projects Tailored to Your Stack
                </h2>
                <p className="text-xs text-slate-500">
                  Collaborations where your skills directly fit the required technology stack.
                </p>
              </div>
            </div>

            {recommendations?.recommendedProjects?.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No active projects found matching your stack. Try updating your profile skills!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations?.recommendedProjects?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Match Score Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                          <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                          {item.matchScorePercentage}% Skill Match
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.project.status}
                        </span>
                      </div>

                      <Link
                        to={`/projects/${item.project.id}`}
                        className="font-bold text-slate-900 text-base hover:text-brand-600 transition-colors line-clamp-1 mb-1 block"
                      >
                        {item.project.title}
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {item.project.description}
                      </p>

                      {/* Matching Skills */}
                      {item.matchingSkills && item.matchingSkills.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> You Have These Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.matchingSkills.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-lg"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Led by {item.project.owner?.fullName?.split(' ')[0]}
                      </span>
                      <Link
                        to={`/projects/${item.project.id}`}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all"
                      >
                        View Project
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Recommended Collaborators */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Potential Teammates & Collaborators
                </h2>
                <p className="text-xs text-slate-500">
                  Users with high common interests and complementary technical abilities.
                </p>
              </div>
            </div>

            {recommendations?.recommendedCollaborators?.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No matching collaborators found at this time.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations?.recommendedCollaborators?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Match synergy badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          {item.matchScorePercentage}% Synergy Score
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.user.role === 'ROLE_DEVELOPER' ? 'Developer' : 'Student'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Link to={`/profile/${item.user.username}`}>
                          <img
                            src={
                              item.user.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.user.fullName
                              )}&background=6366f1&color=fff`
                            }
                            alt={item.user.fullName}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/profile/${item.user.username}`}
                            className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                          >
                            {item.user.fullName}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {item.user.headline || `@${item.user.username}`}
                          </p>
                        </div>
                      </div>

                      {/* Complementary skills */}
                      {item.complementarySkills && item.complementarySkills.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Complementary Tech:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.complementarySkills.slice(0, 3).map((cs, csIdx) => (
                              <span
                                key={csIdx}
                                className="px-2 py-0.5 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/50 rounded-lg"
                              >
                                + {cs}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/profile/${item.user.username}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/messages?user=${item.user.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        project={selectedProjectForApp}
        isOpen={!!selectedProjectForApp}
        onClose={() => setSelectedProjectForApp(null)}
        onApplied={() => {
          setSelectedProjectForApp(null);
          fetchRecommendations();
        }}
      />
    </div>
  );
}
