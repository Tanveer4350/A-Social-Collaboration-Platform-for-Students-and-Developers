import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderGit2,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  Code
} from 'lucide-react';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ApplicationModal from '../components/ApplicationModal';

export default function ProjectsPage({ onOpenCreateProject }) {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [techFilter, setTechFilter] = useState('');
  const [selectedProjectForApp, setSelectedProjectForApp] = useState(null);
  const isMyProjects = searchParams.get('my') === 'true';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let res;
      if (isMyProjects && isAuthenticated) {
        res = await projectService.getUserProjects(user.username);
      } else {
        res = await projectService.getAllProjects(
          selectedStatus || null,
          techFilter || null
        );
      }
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedStatus, techFilter, isMyProjects]);

  const handleApplied = (projectId, application) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? { ...p, hasApplied: true, applicationStatus: 'PENDING' }
          : p
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white mb-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Project Collaboration Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Discover & Build Together
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Find teams building innovative open source projects, capstones, hackathon tools, and full-stack software. Join as a collaborator or launch your own vision.
          </p>

          {isAuthenticated && (
            <button
              onClick={onOpenCreateProject}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-500/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Start a New Project
            </button>
          )}
        </div>

        {/* Decorative Background Art */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <FolderGit2 className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => {
              setSelectedStatus('');
              setSearchParams({});
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !selectedStatus && !isMyProjects
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setSelectedStatus('OPEN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'OPEN'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Recruiting (OPEN)
          </button>
          <button
            onClick={() => setSelectedStatus('IN_PROGRESS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'IN_PROGRESS'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedStatus('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'COMPLETED'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setSearchParams({ my: 'true' })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isMyProjects
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              My Projects
            </button>
          )}
        </div>

        {/* Tech Filter Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            placeholder="Filter by tech (e.g. React, Docker)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4 h-64"
            >
              <div className="w-2/3 h-4 bg-slate-200 rounded" />
              <div className="w-full h-3 bg-slate-100 rounded" />
              <div className="w-4/5 h-3 bg-slate-100 rounded" />
              <div className="flex gap-2 pt-6">
                <div className="w-16 h-5 bg-slate-200 rounded" />
                <div className="w-16 h-5 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No projects matching your filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new project to start recruiting teammates.
          </p>
          {isAuthenticated && (
            <button
              onClick={onOpenCreateProject}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl"
            >
              Start Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onApplyClick={(proj) => setSelectedProjectForApp(proj)}
            />
          ))}
        </div>
      )}

      {/* Application Pitch Modal */}
      <ApplicationModal
        project={selectedProjectForApp}
        isOpen={!!selectedProjectForApp}
        onClose={() => setSelectedProjectForApp(null)}
        onApplied={handleApplied}
      />
    </div>
  );
}
