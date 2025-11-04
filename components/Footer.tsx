import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-xl">
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">

            {/* Main Footer Content */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">

              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/uncryptologo.png"
                    alt="UnCrypto Logo"
                    width={44}
                    height={44}
                    className="w-11 h-11"
                  />
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
  );
}
