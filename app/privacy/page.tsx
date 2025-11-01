'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
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
            <Link href="/support" className="text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
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
                  className="block text-gray-400 hover:text-white transition-all text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer"
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
      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 sm:mb-4 antialiased"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-400 antialiased"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Last updated: January 2025
          </motion.p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Privacy First Banner */}
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 antialiased">Privacy First Approach</h2>
            <p className="text-base text-gray-300 leading-relaxed antialiased max-w-2xl mx-auto">
              Our exchange prioritizes your privacy while maintaining necessary operational security.
            </p>
          </motion.div>

          {/* Data Collection Card */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white antialiased">Data Collection</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">Minimal data collection for transaction processing only</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">No identity verification required for exchanges</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">No registration needed - start trading immediately</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">No third-party analytics tracking your activity</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">No marketing trackers or invasive monitoring</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">Temporary transaction data retained only as needed</span>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300 antialiased">Basic transaction monitoring for security only</span>
              </div>
            </div>
          </motion.div>

          {/* Data Usage & Retention */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.section
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-4 antialiased">Data Usage</h2>
              <p className="text-sm text-gray-400 leading-relaxed antialiased">
                We balance user privacy with operational requirements to provide a secure and reliable service. <span className="text-white font-semibold">Your privacy is not a product to be sold.</span>
              </p>
            </motion.section>

            <motion.section
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-4 antialiased">Data Retention</h2>
              <p className="text-sm text-gray-400 leading-relaxed antialiased">
                All transaction-related data is <span className="text-white font-semibold">automatically purged after successful completion</span>. We maintain zero permanent records of your trading activity.
              </p>
            </motion.section>
          </div>

          {/* Contact */}
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-white mb-3 antialiased">Questions About Privacy?</h3>
            <p className="text-sm text-gray-400 antialiased">
              Contact us at <a href="mailto:support@uncrypto.com" className="text-white font-semibold hover:underline">support@uncrypto.com</a>
            </p>
          </motion.div>

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
