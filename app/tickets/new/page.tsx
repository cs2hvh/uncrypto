'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';
import type { TicketCategory } from '@/types/ticket';
import { toast } from 'sonner';

export default function NewTicketPage() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [category, setCategory] = useState<TicketCategory>('technical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = [
    { value: 'technical' as TicketCategory, label: 'Technical Support', desc: 'Platform issues, bugs, or technical problems' },
    { value: 'billing' as TicketCategory, label: 'Billing & Payments', desc: 'Fee inquiries, refunds, or payment issues' },
    { value: 'sales' as TicketCategory, label: 'Sales & Partnerships', desc: 'Business inquiries or collaboration requests' },
    { value: 'other' as TicketCategory, label: 'General Inquiry', desc: 'Other questions or feedback' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setTicketId(data.ticketId);
        setTicketCreated(true);
        toast.success('Ticket created successfully');
      } else {
        toast.error(data.error || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (ticketCreated) {
    return (
      <div className="relative min-h-screen w-full bg-black">
        <motion.nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-black">U</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight antialiased">UnCrypto</h1>
            </Link>
          </div>
        </motion.nav>

        <div className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>

              <h1 className="text-2xl font-semibold text-white mb-2 antialiased">
                Ticket Created Successfully
              </h1>
              <p className="text-sm text-gray-400 mb-8 antialiased">
                Your support ticket has been submitted. Please save your ticket ID.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide antialiased">Ticket ID</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <code className="text-xl font-mono font-semibold text-white tracking-wider antialiased">
                    {ticketId}
                  </code>
                  <button onClick={copyTicketId} className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer" title="Copy">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3">
                  <p className="text-xs text-amber-400 flex items-start gap-2 antialiased">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Important:</strong> Save this ticket ID. You will need it to access and track your ticket.</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/tickets/${ticketId}`} className="flex-1 bg-white text-black text-sm font-medium py-2.5 px-4 rounded hover:bg-white/90 transition-colors antialiased cursor-pointer">
                  View Ticket
                </Link>
                <Link href="/tickets" className="flex-1 bg-white/10 border border-white/10 text-white text-sm font-medium py-2.5 px-4 rounded hover:bg-white/20 transition-colors antialiased cursor-pointer">
                  Access Another Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Link href="/tickets" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
            Access Ticket
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2 antialiased">Create Support Ticket</h1>
            <p className="text-sm text-gray-400 antialiased">Submit a ticket and our team will respond within 2-4 hours</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <label className="block text-sm font-medium text-white mb-3 antialiased">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent antialiased cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2 antialiased">
                {categories.find(c => c.value === category)?.desc}
              </p>
            </div>

            {/* Subject */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <label className="block text-sm font-medium text-white mb-3 antialiased">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                required
                maxLength={255}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent antialiased"
              />
              <p className="text-xs text-gray-500 mt-2 antialiased">{subject.length}/255 characters</p>
            </div>

            {/* Message with Rich Text Editor */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <label className="block text-sm font-medium text-white mb-3 antialiased">Description</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide detailed information about your issue. Include any relevant error messages, steps to reproduce, or screenshots."
                required
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none antialiased"
              />
              <p className="text-xs text-gray-500 mt-2 antialiased">Provide as much detail as possible to help us resolve your issue quickly</p>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Link href="/support" className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white antialiased cursor-pointer">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className={`px-6 py-2.5 text-sm font-medium rounded transition-all antialiased ${
                  isSubmitting || !subject.trim() || !message.trim()
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90 cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
