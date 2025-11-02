'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, AlertCircle, Plus, ArrowRight } from 'lucide-react';

export default function TicketsPage() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(`/api/tickets/${ticketId.trim()}`);

      if (response.ok) {
        router.push(`/tickets/${ticketId.trim()}`);
      } else if (response.status === 404) {
        setError('Ticket not found. Please check your ticket ID.');
      } else {
        setError('Failed to fetch ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch ticket. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Navbar - Same as main site */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-black">U</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight antialiased">UnCrypto</h1>
          </Link>
          <Link href="/support" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
            Support
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Search Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-3 antialiased">
                  Access Your Ticket
                </h1>
                <p className="text-sm text-gray-400 antialiased">
                  Enter your ticket ID to view conversation history and add new replies
                </p>
              </div>

              {/* Search Form */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6 mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 antialiased">
                      Ticket ID
                    </label>
                    <input
                      type="text"
                      value={ticketId}
                      onChange={(e) => {
                        setTicketId(e.target.value.toUpperCase());
                        setError('');
                      }}
                      placeholder="TKT-XXXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-gray-500 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent antialiased"
                    />
                    {error && (
                      <motion.div
                        className="mt-3 bg-red-500/10 border border-red-500/20 rounded p-3 flex items-start gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-400 antialiased">{error}</p>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching || !ticketId.trim()}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-medium rounded transition-all antialiased ${
                      isSearching || !ticketId.trim()
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-white/90 active:scale-[0.98] cursor-pointer'
                    }`}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Access Ticket
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Create New Ticket CTA */}
              <Link
                href="/tickets/new"
                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-5 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white antialiased">Need Help?</h3>
                      <p className="text-xs text-gray-400 antialiased">Create a new support ticket</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>

            {/* Right: Info & Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* How it Works */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4 antialiased">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-white antialiased">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1 antialiased">Enter Your Ticket ID</h4>
                      <p className="text-xs text-gray-400 antialiased">Use the unique ID provided when you created your ticket</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-white antialiased">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1 antialiased">View Conversation</h4>
                      <p className="text-xs text-gray-400 antialiased">See all messages between you and our support team</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-white antialiased">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1 antialiased">Reply Anytime</h4>
                      <p className="text-xs text-gray-400 antialiased">Add new messages and track your ticket status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-blue-400 antialiased">Important Tips</h3>
                </div>
                <ul className="space-y-2 text-xs text-gray-300 antialiased">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Save your ticket ID in a safe place for future access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Bookmark the ticket page once opened for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Tickets are checked every 30 seconds for new replies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    <span>Our team responds within 2-4 hours during business hours</span>
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4 antialiased">Our Commitment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1 antialiased">2-4h</div>
                    <div className="text-xs text-gray-400 antialiased">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1 antialiased">24/7</div>
                    <div className="text-xs text-gray-400 antialiased">Support Available</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
