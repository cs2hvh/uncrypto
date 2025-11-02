'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Copy, Check, RefreshCw, Send, Clock } from 'lucide-react';
import type { TicketWithMessages, Message } from '@/types/ticket';
import { formatTimestamp, formatDate } from '@/lib/ticket-utils';
import { toast } from 'sonner';

export default function TicketPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Ticket not found');
        } else {
          setError('Failed to load ticket');
        }
        return;
      }

      const data = await response.json();
      setTicket(data.ticket);
      setMessages(data.messages);
      setError('');

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError('Failed to load ticket');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTicket();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isSending) return;

    if (trimmedMessage.length > 10000) {
      toast.error('Message is too long (max 10,000 characters)');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        await fetchTicket();
        toast.success('Message sent successfully');
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

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✕</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2 antialiased">{error}</h1>
          <p className="text-sm text-gray-400 mb-6 antialiased">Please check your ticket ID and try again</p>
          <Link href="/tickets" className="inline-block bg-white text-black text-sm font-medium py-2 px-4 rounded hover:bg-white/90 transition-colors antialiased cursor-pointer">
            Go Back
          </Link>
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
      {/* Navbar - Same as main site */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-black">U</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight antialiased">UnCrypto</h1>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/tickets" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              Access Ticket
            </Link>
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 sm:pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Ticket Header - Full Width at Top */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden mb-6">
            <div className="p-6 sm:p-8 border-b border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {/* Ticket ID Badge */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">Ticket ID</span>
                    <button
                      onClick={copyTicketId}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 transition-all cursor-pointer group"
                      title="Copy ticket ID"
                    >
                      <span className="text-sm font-mono font-semibold text-white antialiased tracking-wide">{ticketId}</span>
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white antialiased leading-tight">{ticket.subject}</h1>
                </div>
              </div>

              {/* Status & Info - Inline */}
              <div className="flex flex-wrap items-center gap-3">
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
              </div>
            </div>

            {ticket.status === 'closed' && (
              <div className="bg-white/5 border-t border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 text-base">ℹ</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mb-1 antialiased">Ticket Closed</div>
                    <p className="text-xs text-gray-400 antialiased">This ticket has been closed and no longer accepts new replies.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Section */}
          <div>

            {/* Messages */}
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
                            <span className="text-sm font-medium text-white antialiased">You</span>
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
                          </div>
                          <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap antialiased text-left">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-white antialiased">CS</span>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
                  <div ref={messagesEndRef} />
                </div>

              {/* Reply Form */}
              {ticket.status !== 'closed' && (
                <div className="border-t border-white/10 p-6">
                  <form onSubmit={handleSendMessage}>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-400 mb-2 block antialiased">Write your reply</label>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 resize-none antialiased transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 antialiased">
                          <span className="hidden sm:inline">Press Enter to send • </span>Shift + Enter for new line
                        </span>
                        {newMessage.trim() && (
                          <span className="text-xs text-gray-400 antialiased">{newMessage.length} chars</span>
                        )}
                      </div>
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
              )}
            </div>

            {/* Support Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1 antialiased">Response Time</h3>
                  <p className="text-xs text-gray-400 leading-relaxed antialiased mb-2">
                    Our support team typically responds within 2-4 hours during business hours.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-400 antialiased">Auto-refresh enabled (30s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
