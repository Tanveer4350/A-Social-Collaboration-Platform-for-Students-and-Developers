import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { projectService } from '../services/api';

export default function ApplicationModal({ project, isOpen, onClose, onApplied }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const res = await projectService.applyToProject(project.id, message.trim());
      if (onApplied) onApplied(project.id, res.data);
      onClose();
    } catch (err) {
      console.error('Apply error:', err);
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Join Collaboration Team</h3>
            <p className="text-xs text-brand-600 font-semibold">{project.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pitch / Why are you a good fit?
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your background, relevant skills (e.g., React, Java, Docker), past projects, and what you'd like to work on..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm shadow-brand-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Send Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
