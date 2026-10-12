import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Trash2,
  Send,
  MoreHorizontal,
  Code,
  Sparkles
} from 'lucide-react';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onPostDeleted, onTagClick }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser || false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.recentComments || []);
  const [commentText, setCommentText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));
      await postService.toggleLike(post.id);
    } catch (err) {
      console.error('Like error:', err);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(post.likesCount);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await postService.addComment(post.id, commentText.trim());
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.deletePost(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await postService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  const copyCodeToClipboard = () => {
    if (!post.codeSnippet) return;
    navigator.clipboard.writeText(post.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyPostLink = () => {
    const url = `${window.location.origin}/#post-${post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article
      id={`post-${post.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?.username}`}>
            <img
              src={
                post.author?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.author?.fullName || 'User'
                )}&background=6366f1&color=fff`
              }
              alt={post.author?.fullName}
              className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-sm hover:scale-105 transition-transform"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post.author?.username}`}
                className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
              >
                {post.author?.fullName}
              </Link>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  post.author?.role === 'ROLE_DEVELOPER'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                }`}
              >
                {post.author?.role === 'ROLE_DEVELOPER' ? 'Developer' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {post.author?.headline || `@${post.author?.username}`}
            </p>
            <span className="text-[11px] text-slate-400">
              {formatTimestamp(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Post Options Menu */}
        {post.owner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
                <button
                  onClick={handleDeletePost}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Text Content */}
      <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line mb-4 font-normal">
        {post.content}
      </div>

      {/* Code Snippet Box */}
      {post.codeSnippet && (
        <div className="my-4 rounded-xl overflow-hidden bg-slate-950 text-slate-100 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Code className="w-3.5 h-3.5 text-brand-400" />
              <span>{post.language || 'code'}</span>
            </div>
            <button
              onClick={copyCodeToClipboard}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Tags Chips */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2.5 py-0.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/40 rounded-lg transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Post Actions (Like, Comment, Share) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-slate-500 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              isLiked
                ? 'text-rose-600 bg-rose-50 font-bold scale-105'
                : 'hover:text-rose-600 hover:bg-slate-100'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-brand-600 hover:bg-slate-100 transition-colors ${
              showComments ? 'text-brand-600 bg-brand-50 font-semibold' : ''
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </button>
        </div>

        <button
          onClick={copyPostLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Share Link"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {/* Add Comment Input */}
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a constructive comment..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No comments yet. Start the conversation!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-xl text-xs"
                >
                  <div className="flex items-start gap-2">
                    <Link to={`/profile/${comment.author?.username}`}>
                      <img
                        src={
                          comment.author?.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.author?.fullName || 'User'
                          )}&background=6366f1&color=fff`
                        }
                        alt={comment.author?.fullName}
                        className="w-6 h-6 rounded-lg object-cover mt-0.5"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/profile/${comment.author?.username}`}
                          className="font-bold text-slate-800 hover:underline"
                        >
                          {comment.author?.fullName}
                        </Link>
                        <span className="text-[10px] text-slate-400">
                          {formatTimestamp(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-0.5">{comment.content}</p>
                    </div>
                  </div>

                  {comment.owner && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}
