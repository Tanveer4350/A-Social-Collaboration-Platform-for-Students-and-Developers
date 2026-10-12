import React, { useState } from 'react';
import { X, FolderPlus, Tag, Link2, Github, Users, Sparkles } from 'lucide-react';
import { projectService } from '../services/api';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    tagLine: '',
    description: '',
    maxMembers: 4,
    status: 'OPEN',
    repositoryUrl: '',
    liveDemoUrl: '',
  });

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim().replace(/,/g, '');
      if (val && !requiredSkills.includes(val)) {
        setRequiredSkills([...requiredSkills, val]);
      }
      setSkillInput('');
    }
  };

  const handleAddTech = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const val = techInput.trim().replace(/,/g, '');
      if (val && !techStack.includes(val)) {
        setTechStack([...techStack, val]);
      }
      setTechInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        ...formData,
        requiredSkills,
        techStack,
      };

      const res = await projectService.createProject(payload);
      if (onProjectCreated) onProjectCreated(res.data);
      onClose();
    } catch (err) {
      console.error('Create project error:', err);
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full my-8 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Initiate Collaboration Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI-Powered Study Assistant"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              One-line Tagline
            </label>
            <input
              type="text"
              value={formData.tagLine}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              placeholder="e.g. Real-time note summarization and quiz generator for students"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Objectives *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the problem, architecture, what you aim to build, and member roles needed..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Max Team Members
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 2 })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              >
                <option value="OPEN">Recruiting (OPEN)</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Skills / Roles
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-lg border border-brand-200/50"
                >
                  {skill}
                  <button type="button" onClick={() => setRequiredSkills(requiredSkills.filter(s => s !== skill))}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. React, Spring Boot, UI/UX (press Enter)"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg"
                >
                  {tech}
                  <button type="button" onClick={() => setTechStack(techStack.filter(t => t !== tech))}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
              placeholder="e.g. Docker, PostgreSQL, Tailwind (press Enter)"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Repository
              </label>
              <input
                type="url"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Live Demo / Preview
              </label>
              <input
                type="url"
                value={formData.liveDemoUrl}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
