import React, { useState } from 'react';
import { X, Code, Tag, Send, Sparkles } from 'lucide-react';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('java');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '').replace(/,/g, '');
      if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter some post content');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        content: content.trim(),
        codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : null,
        language: showCodeInput && codeSnippet.trim() ? language : null,
        tags: tags,
      };

      const res = await postService.createPost(payload);
      if (onPostCreated) onPostCreated(res.data);
      // Reset form
      setContent('');
      setCodeSnippet('');
      setShowCodeInput(false);
      setTags([]);
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Share Technical Knowledge</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.fullName || 'User'
                )}&background=6366f1&color=fff`
              }
              alt={user?.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
              <p className="text-xs text-slate-400">Posting to Developer Community</p>
            </div>
          </div>

          {/* Content TextArea */}
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What technical problem did you solve today? Share code snippets, tips, architectural ideas, or ask for peer feedback..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none transition-all"
            autoFocus
          />

          {/* Optional Code Snippet Input */}
          {showCodeInput && (
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-brand-400" /> Code Snippet
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 outline-none"
                >
                  <option value="java">Java</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL</option>
                  <option value="html">HTML / CSS</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="bash">Bash / Shell</option>
                </select>
              </div>
              <textarea
                rows={4}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste clean code snippet here..."
                className="w-full bg-slate-900 text-emerald-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:border-brand-500 outline-none resize-none"
              />
            </div>
          )}

          {/* Tag Chips and Input */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60 rounded-xl"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (e.g. SpringBoot, React, SystemDesign) - press Enter"
                  className="flex-1 text-xs text-slate-700 placeholder-slate-400 py-1.5 outline-none bg-transparent"
                />
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                showCodeInput
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Code className="w-4 h-4" />
              {showCodeInput ? 'Remove Code' : 'Attach Code Snippet'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm shadow-brand-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
