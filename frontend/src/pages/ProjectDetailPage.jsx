import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Users,
  ExternalLink,
  Github,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  Shield,
  Trash2,
  Edit,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { projectService, messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationModal from '../components/ApplicationModal';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [teamMessages, setTeamMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'applications', 'team-chat'
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submittingChat, setSubmittingChat] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjectById(id);
      setProject(res.data);

      if (res.data.isOwner) {
        const appsRes = await projectService.getProjectApplications(id);
        setApplications(appsRes.data);
      }

      if (res.data.isMember) {
        const msgRes = await messageService.getProjectConversation(id);
        setTeamMessages(msgRes.data);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, isAuthenticated]);

  const handleRespondApplication = async (appId, status) => {
    try {
      await projectService.respondToApplication(appId, status);
      setApplications(
        applications.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      // Refresh project to update members list
      const projRes = await projectService.getProjectById(id);
      setProject(projRes.data);
    } catch (err) {
      console.error('Failed to respond to application:', err);
    }
  };

  const handleSendTeamMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || submittingChat) return;

    try {
      setSubmittingChat(true);
      const res = await messageService.sendMessage({
        projectId: project.id,
        content: chatMessage.trim(),
      });
      setTeamMessages([...teamMessages, res.data]);
      setChatMessage('');
    } catch (err) {
      console.error('Failed to send team message:', err);
    } finally {
      setSubmittingChat(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(project.id);
      navigate('/projects');
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-medium">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <Link to="/projects" className="text-xs text-brand-600 font-bold hover:underline mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Project Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  project.status === 'OPEN'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : project.status === 'IN_PROGRESS'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                ● {project.status}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            {project.tagLine && (
              <p className="text-sm text-slate-600 font-medium">
                {project.tagLine}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {project.isOwner ? (
              <button
                onClick={handleDeleteProject}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200/60"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : project.isMember ? (
              <span className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                ✓ Team Member
              </span>
            ) : project.hasApplied ? (
              <span className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl">
                Application: {project.applicationStatus}
              </span>
            ) : project.status === 'OPEN' && isAuthenticated ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Apply to Join
              </button>
            ) : null}
          </div>
        </div>

        {/* External Links */}
        <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-slate-100">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'overview'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Overview
        </button>

        {project.isOwner && (
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'applications'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Applications ({applications.filter(a => a.status === 'PENDING').length} pending)
          </button>
        )}

        {project.isMember && (
          <button
            onClick={() => setActiveTab('team-chat')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'team-chat'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Team Workspace Chat
          </button>
        )}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Project Scope & Architecture
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Skills and Tech Stack */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Required Skills / Roles
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/60 rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Team & Lead Info */}
          <div className="space-y-6">
            {/* Project Lead */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Project Creator / Lead
              </span>
              <div className="flex items-center gap-3">
                <Link to={`/profile/${project.owner.username}`}>
                  <img
                    src={
                      project.owner.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        project.owner.fullName
                      )}&background=6366f1&color=fff`
                    }
                    alt={project.owner.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${project.owner.username}`}
                    className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                  >
                    {project.owner.fullName}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {project.owner.headline || `@${project.owner.username}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Team Members
                </span>
                <span className="text-xs font-bold text-brand-600">
                  {project.currentMembersCount} / {project.maxMembers}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Owner entry */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={
                        project.owner.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          project.owner.fullName
                        )}&background=6366f1&color=fff`
                      }
                      alt={project.owner.fullName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {project.owner.fullName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    Lead
                  </span>
                </div>

                {/* Other members */}
                {project.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <Link
                      to={`/profile/${member.username}`}
                      className="flex items-center gap-2 min-w-0"
                    >
                      <img
                        src={
                          member.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.fullName
                          )}&background=6366f1&color=fff`
                        }
                        alt={member.fullName}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate hover:text-brand-600">
                        {member.fullName}
                      </span>
                    </Link>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                      Collaborator
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Management (For Owner) */}
      {activeTab === 'applications' && project.isOwner && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Collaboration Requests & Pitch Notes
          </h3>

          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No applications received yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${app.applicant.username}`}>
                        <img
                          src={
                            app.applicant.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              app.applicant.fullName
                            )}&background=6366f1&color=fff`
                          }
                          alt={app.applicant.fullName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${app.applicant.username}`}
                          className="font-bold text-sm text-slate-900 hover:text-brand-600"
                        >
                          {app.applicant.fullName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {app.applicant.headline || `@${app.applicant.username}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          app.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {app.status}
                      </span>

                      {app.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => handleRespondApplication(app.id, 'ACCEPTED')}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleRespondApplication(app.id, 'REJECTED')}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 bg-slate-100 rounded-xl"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {app.message && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">Applicant's Note:</span>
                      {app.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Workspace Team Chat */}
      {activeTab === 'team-chat' && project.isMember && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {project.title} — Team Chat
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {project.currentMembersCount} Members
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {teamMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet. Greet the team and start discussing tasks!
              </div>
            ) : (
              teamMessages.map((msg) => {
                const isSelf = currentUser && msg.sender.id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isSelf ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <img
                      src={
                        msg.sender.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          msg.sender.fullName
                        )}&background=6366f1&color=fff`
                      }
                      alt={msg.sender.fullName}
                      className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                    />
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs ${
                        isSelf
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <span className="font-bold text-[11px] block mb-0.5 opacity-80">
                        {msg.sender.fullName}
                      </span>
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <span className="text-[9px] opacity-60 block text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendTeamMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Send message to team..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
            <button
              type="submit"
              disabled={submittingChat || !chatMessage.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm shadow-brand-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        project={project}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onApplied={() => {
          setProject({ ...project, hasApplied: true, applicationStatus: 'PENDING' });
          setShowApplyModal(false);
        }}
      />
    </div>
  );
}
