'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Send, Save, Trash2 } from 'lucide-react';
import type { TicketWithMessages, Message } from '@/types/ticket';
import { formatTimestamp, formatDate } from '@/lib/ticket-utils';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'sonner';

export default function AdminTicketPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        setMessages(data.messages);
        setNewStatus(data.ticket.status);
        setNewPriority(data.ticket.priority);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage, isInternal }),
      });

      if (response.ok) {
        setNewMessage('');
        setIsInternal(false);
        await fetchTicket();
        toast.success(isInternal ? 'Internal note added' : 'Reply sent successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateTicket = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, priority: newPriority }),
      });

      if (response.ok) {
        await fetchTicket();
        toast.success('Ticket updated successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Ticket deleted successfully');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    fetchTicket();

    const interval = setInterval(fetchTicket, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-400 antialiased">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { label: 'Open', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      in_progress: { label: 'In Progress', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      waiting_customer: { label: 'Awaiting Response', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      resolved: { label: 'Resolved', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
      closed: { label: 'Closed', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
    };
    return badges[status as keyof typeof badges] || badges.open;
  };

  const statusBadge = getStatusBadge(ticket.status);

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 antialiased">Delete Ticket</h3>
                <p className="text-sm text-gray-400 antialiased">
                  Are you sure you want to delete this ticket? This action cannot be undone. All messages and data will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={isDeleting}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isDeleting
                    ? 'bg-red-500/20 text-red-300 cursor-not-allowed'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 cursor-pointer'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete Ticket'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-medium antialiased cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 sm:pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Ticket Header & Management - AT TOP */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden mb-6">
            <div className="p-6 sm:p-8 border-b border-white/10">
              {/* Ticket ID Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">Ticket ID</span>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-mono font-semibold text-white antialiased tracking-wide">{ticketId}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 antialiased leading-tight">{ticket.subject}</h1>

              {/* Status & Info - Inline */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium border rounded-md ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>

                <div className="h-4 w-px bg-white/10"></div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 antialiased">Category:</span>
                  <span className="text-sm font-medium text-white antialiased capitalize">{ticket.category}</span>
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 antialiased">Priority:</span>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${
                    ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    ticket.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-white/5 text-gray-300 border border-white/10'
                  }`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 antialiased">Created:</span>
                  <span className="text-sm font-medium text-white antialiased">{formatDate(ticket.created_at)}</span>
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 antialiased">Updated:</span>
                  <span className="text-sm font-medium text-white antialiased">{formatDate(ticket.updated_at)}</span>
                </div>
              </div>

              {/* Management Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-2 antialiased">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 antialiased cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_customer">Awaiting Response</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-2 antialiased">Update Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 antialiased cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleUpdateTicket}
                      disabled={isUpdating}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all antialiased ${
                        isUpdating
                          ? 'bg-white/10 text-white/40 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-white/90 cursor-pointer active:scale-95'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                {/* Delete Ticket */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-red-400 mb-1 antialiased">Delete Ticket</h3>
                      <p className="text-xs text-gray-400 antialiased">Permanently remove this ticket and all messages</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-md transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white antialiased">Conversation</h2>
                <div className="text-xs text-gray-500 antialiased">{messages.length} {messages.length === 1 ? 'message' : 'messages'}</div>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex gap-4 ${message.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* User messages on LEFT */}
                  {message.sender_type === 'user' && (
                    <>
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-white antialiased">User</span>
                        </div>
                      </div>
                      <div className="flex-1 max-w-[70%]">
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="text-xs text-gray-500 antialiased">{formatTimestamp(message.created_at)}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap antialiased">{message.message}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Admin messages on RIGHT */}
                  {message.sender_type === 'admin' && (
                    <>
                      <div className="flex-1 max-w-[70%]">
                        <div className="flex items-baseline gap-2 mb-1.5 justify-end">
                          <span className="text-xs text-gray-500 antialiased">{formatTimestamp(message.created_at)}</span>
                          {message.is_internal && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap antialiased text-left">{message.message}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-white antialiased">You</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Form with Rich Text Editor */}
            <div className="border-t border-white/10 p-6">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-2 block antialiased">Write your reply</label>
                  <RichTextEditor
                    content={newMessage}
                    onChange={setNewMessage}
                    placeholder="Type your reply..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer"
                    />
                    <span className="text-xs text-gray-400 antialiased">Internal note (hidden from customer)</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all antialiased ${
                      isSending || !newMessage.trim()
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-white/90 cursor-pointer active:scale-95'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
