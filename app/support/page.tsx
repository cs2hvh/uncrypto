'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Clock, Shield, Zap, Users, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does a swap take?",
      answer: "Most swaps are completed within 5-30 minutes. The exact time depends on network congestion and the number of confirmations required for your selected cryptocurrencies. Bitcoin typically requires 1-3 confirmations, while Ethereum needs 12-20 confirmations for security."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! Our service is completely anonymous. You don't need to register, create an account, or provide any personal information. Just enter your wallet address and start swapping. We believe in your right to privacy."
    },
    {
      question: "What are the fees?",
      answer: "We charge a flat 0.1% fee on all transactions. This is one of the lowest rates in the industry. There are no hidden fees - what you see is what you get. Network fees (gas fees) are paid separately and go directly to the blockchain miners."
    },
    {
      question: "What cryptocurrencies do you support?",
      answer: "We currently support 10+ major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Ripple (XRP), Cardano (ADA), Polkadot (DOT), Dogecoin (DOGE), Solana (SOL), Polygon (MATIC), and Tether (USDT). We're constantly adding new coins based on user demand."
    },
    {
      question: "Is there a minimum or maximum swap amount?",
      answer: "Minimum amounts vary by cryptocurrency but typically start from $10 equivalent. Maximum amounts depend on our available reserves and can go up to $100,000 per transaction. For larger amounts, please contact our support team for assistance."
    },
    {
      question: "What if I enter the wrong address?",
      answer: "Cryptocurrency transactions are irreversible. Always double-check your receiving address before confirming. We recommend using the refund address field as a safety measure. If you do make a mistake, contact our support immediately - while we can't reverse blockchain transactions, we may be able to help in some cases."
    },
    {
      question: "How do I track my swap?",
      answer: "After initiating a swap, you'll receive a transaction ID and order number. You can use the transaction ID to track your swap status on the blockchain explorer for your selected cryptocurrency. We also provide real-time updates via email if you choose to provide one."
    },
    {
      question: "What if my swap is delayed or stuck?",
      answer: "If your swap takes longer than expected, it's usually due to network congestion. Check the transaction status on the blockchain explorer. Most delays resolve themselves within a few hours. If there's an issue after 24 hours, contact our support team with your order ID."
    },
    {
      question: "Is my transaction secure?",
      answer: "Yes! We use industry-standard security protocols including SSL encryption, multi-signature wallets, and cold storage for reserves. We never have access to your funds - all swaps are done through smart contracts or atomic swaps when possible."
    },
    {
      question: "Can I cancel my swap?",
      answer: "Once a swap is initiated and sent to the blockchain, it cannot be cancelled. However, if you haven't sent your funds yet, simply don't send them and the order will expire after 30 minutes. Always verify all details before sending."
    },
    {
      question: "Do you offer referral bonuses?",
      answer: "Yes! Our referral program gives you 50% off on fees for every swap you make using a referral code. Share your unique code with friends and earn rewards when they use our service."
    },
    {
      question: "What countries do you serve?",
      answer: "We serve users worldwide with some exceptions due to regulatory restrictions. Our service is currently not available in: North Korea, Iran, Syria, and certain sanctioned regions. Please check your local laws regarding cryptocurrency usage."
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Swaps complete in 5-30 minutes"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "No KYC, no registration needed"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Always here to help you"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Trusted by Many",
      description: "500K+ satisfied users"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-black">U</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight antialiased">
                UnCrypto
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              Swap
            </Link>
            <Link href="/support#faq" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              FAQ
            </Link>
            <Link href="/support" className="text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              Support
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
          >
            {showMobileMenu ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="md:hidden border-t border-white/5 bg-black/80 backdrop-blur-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link
                  href="/"
                  className="block text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Swap
                </Link>
                <Link
                  href="/support#faq"
                  className="block text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/support"
                  className="block text-white font-medium text-sm px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Support
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 sm:mb-4 antialiased"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Support Center
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-400 antialiased"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get answers to your questions about our crypto exchange service
          </motion.p>
        </div>
      </div>

      {/* Ticket System - AT TOP */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 antialiased">
              Need Help?
            </h2>
            <p className="text-base text-gray-400 antialiased">
              Choose your preferred support method
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Create Ticket */}
            <Link
              href="/tickets/new"
              className="group relative bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 hover:border-white/30 rounded-lg overflow-hidden transition-all block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold mb-3 antialiased text-xl">Create New Ticket</h3>
                  <p className="text-gray-400 text-sm antialiased mb-6 leading-relaxed">
                    Submit a detailed support request. Get a unique ticket ID to track your issue and communicate with our team.
                  </p>
                  <div className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <span>Get Started</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Access Existing Ticket */}
            <Link
              href="/tickets"
              className="group relative bg-black/40 hover:bg-black/50 border border-white/10 hover:border-white/20 rounded-lg overflow-hidden transition-all block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold mb-3 antialiased text-xl">Access Your Ticket</h3>
                  <p className="text-gray-400 text-sm antialiased mb-6 leading-relaxed">
                    Have a ticket ID? Continue your conversation, check status updates, and add new messages.
                  </p>
                  <div className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <span>Find Ticket</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Email Support */}
            <a
              href="mailto:support@uncrypto.com"
              className="group relative bg-black/40 hover:bg-black/50 border border-white/10 hover:border-white/20 rounded-lg overflow-hidden transition-all block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold mb-3 antialiased text-xl">Email Support</h3>
                  <p className="text-gray-400 text-sm antialiased mb-6 leading-relaxed">
                    Prefer traditional email? Reach out directly and we'll respond within 2-4 hours.
                  </p>
                  <div className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <span>Send Email</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="relative z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 antialiased">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-400 antialiased">
              Find quick answers to common questions about our service
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.05 }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <h3 className="text-sm sm:text-base text-white font-semibold pr-4 antialiased">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="relative z-10 bg-black/60 backdrop-blur-xl">
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto">

              {/* Main Footer Content */}
              <div className="grid md:grid-cols-2 gap-12 mb-12">

                {/* Brand */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-black">U</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white antialiased">UnCrypto</h3>
                  </div>
                  <p className="text-gray-400 antialiased leading-relaxed mb-6">
                    Fast, secure cryptocurrency exchange with real-time rates. No registration required.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-white font-medium antialiased">All Services Online</span>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold antialiased text-sm">Built for privacy</h4>
                    <p className="text-xs text-gray-500 antialiased leading-relaxed">Your data stays private and secure</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold antialiased text-sm">No KYC required</h4>
                    <p className="text-xs text-gray-500 antialiased leading-relaxed">Swap without verification</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold antialiased text-sm">Anonymous trading</h4>
                    <p className="text-xs text-gray-500 antialiased leading-relaxed">Complete anonymity</p>
                  </div>
                </div>

              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500 antialiased">
                    © 2025 UnCrypto. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <Link href="/support#faq" className="text-sm text-gray-500 hover:text-white transition-colors antialiased cursor-pointer">FAQ</Link>
                    <Link href="/tickets" className="text-sm text-gray-500 hover:text-white transition-colors antialiased cursor-pointer">Support Tickets</Link>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors antialiased cursor-pointer">Privacy</Link>
                    <Link href="/tos" className="text-sm text-gray-500 hover:text-white transition-colors antialiased cursor-pointer">Terms</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
