import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  FolderGit2,
  Send,
  User as UserIcon,
  Sparkles,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { messageService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null); // { type: 'DIRECT'|'PROJECT', id, targetUser, projectTitle }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const targetUserIdFromUrl = searchParams.get('user');

  const fetchConversations = async () => {
    try {
      setLoadingConv(true);
      const res = await messageService.getConversations();
      setConversations(res.data);

      if (targetUserIdFromUrl) {
        // Direct conversation requested via URL
        const uRes = await userService.getProfileById(targetUserIdFromUrl);
        const selected = {
          type: 'DIRECT',
          id: uRes.data.id,
          targetUser: uRes.data,
        };
        setActiveConv(selected);
      } else if (res.data.length > 0 && !activeConv) {
        const first = res.data[0];
        setActiveConv({
          type: first.type,
          id: first.type === 'DIRECT' ? first.otherUser.id : first.projectId,
          targetUser: first.otherUser,
          projectTitle: first.projectTitle,
        });
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeConv) return;
    try {
      setLoadingMessages(true);
      let res;
      if (activeConv.type === 'DIRECT') {
        res = await messageService.getDirectConversation(activeConv.id);
      } else {
        res = await messageService.getProjectConversation(activeConv.id);
      }
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetUserIdFromUrl]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Polling for real-time messages
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || sending) return;

    try {
      setSending(true);
      const payload = {
        content: newMessage.trim(),
        recipientId: activeConv.type === 'DIRECT' ? activeConv.id : null,
        projectId: activeConv.type === 'PROJECT' ? activeConv.id : null,
      };

      const res = await messageService.sendMessage(payload);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
      // Update sidebar conversation preview
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[550px]">
        {/* Conversations Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              Messages & Channels
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet. Visit profiles or projects to start chatting!
              </div>
            ) : (
              conversations.map((conv, idx) => {
                const isSelected =
                  activeConv &&
                  activeConv.type === conv.type &&
                  activeConv.id === (conv.type === 'DIRECT' ? conv.otherUser.id : conv.projectId);

                return (
                  <button
                    key={idx}
                    onClick={() =>
                      setActiveConv({
                        type: conv.type,
                        id: conv.type === 'DIRECT' ? conv.otherUser.id : conv.projectId,
                        targetUser: conv.otherUser,
                        projectTitle: conv.projectTitle,
                      })
                    }
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50/80 border-l-4 border-brand-600'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    {conv.type === 'DIRECT' ? (
                      <img
                        src={
                          conv.otherUser.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            conv.otherUser.fullName
                          )}&background=6366f1&color=fff`
                        }
                        alt={conv.otherUser.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.type === 'DIRECT' ? conv.otherUser.fullName : conv.projectTitle}
                        </h4>
                        {conv.lastMessageTime && (
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-brand-600 rounded-full flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active Conversation Chat Window */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shadow-xs">
                <div className="flex items-center gap-3">
                  {activeConv.type === 'DIRECT' ? (
                    <>
                      <Link to={`/profile/${activeConv.targetUser.username}`}>
                        <img
                          src={
                            activeConv.targetUser.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              activeConv.targetUser.fullName
                            )}&background=6366f1&color=fff`
                          }
                          alt={activeConv.targetUser.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${activeConv.targetUser.username}`}
                          className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                        >
                          {activeConv.targetUser.fullName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {activeConv.targetUser.headline || `@${activeConv.targetUser.username}`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div>
                        <Link
                          to={`/projects/${activeConv.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                        >
                          {activeConv.projectTitle}
                        </Link>
                        <p className="text-xs text-slate-400">Project Workspace Channel</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Message Bubbles Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                {loadingMessages ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No messages in this channel yet. Say hello!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = currentUser && msg.sender.id === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${
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
                          className="w-8 h-8 rounded-xl object-cover flex-shrink-0 mt-0.5"
                        />
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs shadow-xs ${
                            isSelf
                              ? 'bg-brand-600 text-white rounded-tr-none'
                              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {!isSelf && activeConv.type === 'PROJECT' && (
                            <span className="font-bold text-[10px] text-brand-600 block mb-0.5">
                              {msg.sender.fullName}
                            </span>
                          )}
                          <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                          <span
                            className={`text-[9px] block text-right mt-1 ${
                              isSelf ? 'text-brand-200' : 'text-slate-400'
                            }`}
                          >
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
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Write a message to ${
                    activeConv.type === 'DIRECT'
                      ? activeConv.targetUser.fullName
                      : activeConv.projectTitle
                  }...`}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Select a conversation</p>
              <p className="text-xs mt-1">Choose a chat from the left sidebar or start a new direct message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
