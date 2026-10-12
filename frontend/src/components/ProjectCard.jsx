import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Users,
  ExternalLink,
  Github,
  CheckCircle2,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({ project, onApplyClick }) {
  const { user: currentUser } = useAuth();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Recruiting
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300/80 transition-all p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1">
            <Link
              to={`/projects/${project.id}`}
              className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1"
            >
              {project.title}
            </Link>
            {project.tagLine && (
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {project.tagLine}
              </p>
            )}
          </div>
          {getStatusBadge(project.status)}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Tech Stack and Required Skills */}
        <div className="space-y-2 mb-5">
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Looking For Skills:
              </span>
              <div className="flex flex-wrap gap-1">
                {project.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-semibold text-brand-700 bg-brand-50 rounded-lg border border-brand-200/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Stack:
              </span>
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer info & action buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Owner & Team info */}
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${project.owner?.username}`}
            className="flex items-center gap-1.5"
            title={`Led by ${project.owner?.fullName}`}
          >
            <img
              src={
                project.owner?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  project.owner?.fullName || 'User'
                )}&background=6366f1&color=fff`
              }
              alt={project.owner?.fullName}
              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
            />
            <span className="text-xs font-semibold text-slate-700 hover:text-brand-600 hidden sm:inline">
              {project.owner?.fullName?.split(' ')[0]}
            </span>
          </Link>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {project.currentMembersCount || 1}/{project.maxMembers}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {project.isOwner ? (
            <Link
              to={`/projects/${project.id}`}
              className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              Manage Team
            </Link>
          ) : project.isMember ? (
            <Link
              to={`/projects/${project.id}`}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl"
            >
              ✓ Member
            </Link>
          ) : project.hasApplied ? (
            <span className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl">
              Applied ({project.applicationStatus})
            </span>
          ) : project.status === 'OPEN' ? (
            <button
              onClick={() => onApplyClick(project)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> Apply
            </button>
          ) : (
            <Link
              to={`/projects/${project.id}`}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
