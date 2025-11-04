'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LogOut, Filter, Search, Trash2 } from 'lucide-react';
import type { Ticket } from '@/types/ticket';
import { formatDate } from '@/lib/ticket-utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);

      const response = await fetch(`/api/admin/tickets?${params}`);

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, filterCategory]);

  const handleLogout = () => {
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const handleDeleteClick = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    setTicketToDelete(ticketId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setDeletingTicketId(ticketToDelete);
    try {
      const response = await fetch(`/api/admin/tickets/${ticketToDelete}/status`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Ticket deleted successfully');
        await fetchTickets();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    } finally {
      setDeletingTicketId(null);
      setShowDeleteConfirm(false);
      setTicketToDelete(null);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    searchQuery === '' ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-400 antialiased">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setTicketToDelete(null);
                }}
                disabled={deletingTicketId !== null}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={deletingTicketId !== null}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  deletingTicketId !== null
                    ? 'bg-red-500/20 text-red-300 cursor-not-allowed'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 cursor-pointer'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {deletingTicketId !== null ? 'Deleting...' : 'Delete Ticket'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/uncryptologo.png"
              alt="UnCrypto Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold text-white antialiased">UnCrypto Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-medium antialiased cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white mb-1 antialiased">Support Tickets</h1>
            <p className="text-sm text-gray-400 antialiased">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-2 antialiased">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ticket ID or subject..."
                    className="w-full bg-white/5 border border-white/10 rounded pl-10 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent antialiased"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 antialiased">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 antialiased cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Awaiting Response</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 antialiased">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 antialiased cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="sales">Sales</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center">
                <Filter className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-gray-400 antialiased">No tickets found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Last Reply
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider antialiased">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredTickets.map((ticket) => {
                      const statusBadge = getStatusBadge(ticket.status);
                      return (
                        <tr
                          key={ticket.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            <div className="flex flex-col">
                              <span className="text-xs font-mono text-gray-500 mb-1 antialiased">{ticket.id}</span>
                              <span className="text-sm font-medium text-white antialiased">{ticket.subject}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded ${statusBadge.className}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            <span className="text-sm text-gray-300 antialiased capitalize">{ticket.category}</span>
                          </td>
                          <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            <span className="text-sm text-gray-400 antialiased">{formatDate(ticket.updated_at)}</span>
                          </td>
                          <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                ticket.last_reply_by === 'user' ? 'bg-blue-400' : 'bg-gray-500'
                              }`}></span>
                              <span className="text-sm text-gray-400 antialiased capitalize">{ticket.last_reply_by}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => handleDeleteClick(e, ticket.id)}
                              disabled={deletingTicketId === ticket.id}
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                                deletingTicketId === ticket.id
                                  ? 'bg-red-500/10 text-red-300 cursor-not-allowed'
                                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                              {deletingTicketId === ticket.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
