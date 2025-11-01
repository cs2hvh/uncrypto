'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function TOSPage() {
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
            Terms of Service
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

      {/* Terms Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 space-y-8">

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                By accessing and using UnCrypto's cryptocurrency exchange service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">2. Service Description</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased mb-3">
                UnCrypto provides an anonymous cryptocurrency exchange service that allows users to swap various digital currencies. Our service:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-2 antialiased">
                <li>Does not require user registration or KYC verification</li>
                <li>Operates on a non-custodial basis</li>
                <li>Charges a 0.1% transaction fee</li>
                <li>Provides real-time exchange rates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">3. User Responsibilities</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased mb-3">
                As a user of UnCrypto, you agree to:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-2 antialiased">
                <li>Provide accurate wallet addresses for transactions</li>
                <li>Verify all transaction details before confirming</li>
                <li>Comply with your local laws regarding cryptocurrency usage</li>
                <li>Not use our service for illegal activities or money laundering</li>
                <li>Accept that cryptocurrency transactions are irreversible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">4. Privacy and Anonymity</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                We are committed to protecting your privacy. We do not collect personal information, require registration, or track user activities. However, blockchain transactions are public by nature and may be traceable on their respective networks.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">5. Transaction Limits</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                Minimum and maximum transaction amounts vary by cryptocurrency and are subject to change based on network conditions and available reserves. Users are responsible for ensuring their transactions fall within acceptable limits.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">6. Fees and Charges</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                UnCrypto charges a flat 0.1% fee on all transactions. This fee is clearly displayed before you confirm any exchange. Network fees (gas fees) are separate and paid directly to blockchain miners.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">7. Limitation of Liability</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                UnCrypto is not liable for any losses resulting from: incorrect wallet addresses, network delays, price fluctuations, regulatory changes, or force majeure events. Users acknowledge the inherent risks of cryptocurrency trading.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">8. Service Availability</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                While we strive for 24/7 availability, we do not guarantee uninterrupted service. We reserve the right to suspend or modify our service for maintenance, upgrades, or security reasons without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">9. Prohibited Uses</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased mb-3">
                You may not use UnCrypto for:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-2 antialiased">
                <li>Money laundering or terrorist financing</li>
                <li>Fraud or illegal activities</li>
                <li>Violating sanctions or embargoes</li>
                <li>Manipulating markets or engaging in wash trading</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">10. Changes to Terms</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                We reserve the right to modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms. We recommend reviewing this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 antialiased">11. Contact</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed antialiased">
                For questions about these terms, please contact us at <a href="mailto:support@uncrypto.com" className="text-white hover:underline">support@uncrypto.com</a>
              </p>
            </section>

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
