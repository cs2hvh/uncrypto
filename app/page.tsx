'use client';

import Aurora from '@/components/Aurora';
import { ArrowRightLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('XMR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [priceChanges, setPriceChanges] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [receivingAddress, setReceivingAddress] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [amountError, setAmountError] = useState('');
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Reserve amounts (in coins)
  const reserves: Record<string, number> = {
    XMR: 450.5,
    BTC: 12.5,
    LTC: 850,
    DASH: 1200,
    ETH: 250.8,
    'USDT-TRC20': 500000,
    'USDT-ERC20': 500000,
  };

  // Get min/max limits based on reserves
  const getMinAmount = (currency: string): number => {
    // Minimum ~$10 USD equivalent
    const minUsd = 10;
    if (rates[currency] && rates[currency] > 0) {
      return minUsd / rates[currency];
    }
    return 0.001;
  };

  const getMaxAmount = (currency: string): number => {
    // Max is 80% of reserves to maintain liquidity
    return reserves[currency] ? reserves[currency] * 0.8 : 0;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live crypto rates
  const fetchRates = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=monero,bitcoin,litecoin,dash,ethereum,tether&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();

      const ratesMap: Record<string, number> = {
        XMR: data.monero?.usd || 0,
        BTC: data.bitcoin?.usd || 0,
        LTC: data.litecoin?.usd || 0,
        DASH: data.dash?.usd || 0,
        ETH: data.ethereum?.usd || 0,
        'USDT-TRC20': data.tether?.usd || 1,
        'USDT-ERC20': data.tether?.usd || 1,
      };

      const changesMap: Record<string, number> = {
        XMR: data.monero?.usd_24h_change || 0,
        BTC: data.bitcoin?.usd_24h_change || 0,
        LTC: data.litecoin?.usd_24h_change || 0,
        DASH: data.dash?.usd_24h_change || 0,
        ETH: data.ethereum?.usd_24h_change || 0,
        'USDT-TRC20': data.tether?.usd_24h_change || 0,
        'USDT-ERC20': data.tether?.usd_24h_change || 0,
      };
      
      setRates(ratesMap);
      setPriceChanges(changesMap);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  // Fetch rates on mount and every 30 seconds
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate conversion when fromAmount or currencies change
  useEffect(() => {
    setAmountError('');

    if (fromAmount && rates[fromCurrency] && rates[toCurrency]) {
      const fromValue = parseFloat(fromAmount);
      if (!isNaN(fromValue)) {
        // Check min/max limits
        const minAmount = getMinAmount(fromCurrency);
        const maxAmount = getMaxAmount(fromCurrency);

        if (fromValue < minAmount) {
          setAmountError(`Minimum: ${minAmount.toFixed(8)} ${fromCurrency}`);
        } else if (fromValue > maxAmount) {
          setAmountError(`Maximum: ${maxAmount.toFixed(8)} ${fromCurrency}`);
        }

        const fromUsd = fromValue * rates[fromCurrency];
        const toValue = fromUsd / rates[toCurrency];
        setToAmount(toValue.toFixed(8));
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency, rates]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  // Get available currencies for "To" dropdown (excluding "From" currency)
  const getAvailableToCurrencies = () => {
    const allCurrencies = ['XMR', 'BTC', 'LTC', 'DASH', 'ETH', 'USDT-TRC20', 'USDT-ERC20'];
    return allCurrencies.filter(currency => currency !== fromCurrency);
  };

  // Get available currencies for "From" dropdown (excluding "To" currency)
  const getAvailableFromCurrencies = () => {
    const allCurrencies = ['XMR', 'BTC', 'LTC', 'DASH', 'ETH', 'USDT-TRC20', 'USDT-ERC20'];
    return allCurrencies.filter(currency => currency !== toCurrency);
  };

  // Get full crypto name
  const getCryptoName = (currency: string) => {
    const names: Record<string, string> = {
      XMR: 'Monero',
      BTC: 'Bitcoin',
      LTC: 'Litecoin',
      DASH: 'Dash',
      ETH: 'Ethereum',
      'USDT-TRC20': 'Tether (TRC20)',
      'USDT-ERC20': 'Tether (ERC20)',
    };
    return names[currency] || currency;
  };

  // Get exchange rate
  const getExchangeRate = () => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const rate = rates[fromCurrency] / rates[toCurrency];
      return rate.toFixed(6);
    }
    return '0';
  };

  // Get USD value
  const getUsdValue = (amount: string, currency: string) => {
    if (amount && rates[currency]) {
      const value = parseFloat(amount) * rates[currency];
      return value.toFixed(2);
    }
    return '0.00';
  };

  // Get crypto icon - using cryptocurrency-icons CDN (jsdelivr)
  const getCryptoIcon = (currency: string) => {
    const symbols: Record<string, string> = {
      XMR: 'xmr',
      BTC: 'btc',
      LTC: 'ltc',
      DASH: 'dash',
      ETH: 'eth',
      'USDT-TRC20': 'usdt',
      'USDT-ERC20': 'usdt',
    };
    const symbol = symbols[currency] || 'btc';
    return `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${symbol}.svg`;
  };

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Premium Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src="/uncryptologo.png"
              alt="UnCrypto Logo"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9"
            />
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight antialiased">
              UnCrypto
            </h1>
          </motion.div>

          {/* Desktop Navigation Links */}
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
      
      {/* Aurora Background - Below Navbar - Limited Height */}
      <div className="absolute top-[52px] left-0 right-0 h-[600px] overflow-hidden">
        <Aurora
          colorStops={["#1e3a8a", "#1e40af", "#3b82f6"]}
          blend={0.08}
          amplitude={0.8}
          speed={0.03}
        />
        {/* Dark overlay to reduce brightness */}
        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
        {/* Gradient fade to black at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">

          {/* Left Side - Info & Features */}
          <motion.div
            className="flex flex-col items-center lg:items-start justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Heading */}
            <div className="text-center lg:text-left">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-4 sm:mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Automated
                <br />
                <span className="text-gray-300">Crypto Exchange</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Fully automated cryptocurrency swaps with instant execution. Exchange between major privacy coins and stablecoins in seconds.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-300 antialiased">No Registration</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-300 antialiased">Instant Processing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-300 antialiased">24/7 Automated</span>
                </div>
              </motion.div>
            </div>

          </motion.div>

          {/* Right Side - Converter */}
          <motion.div
            className="lg:sticky lg:top-24 max-w-md mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            <motion.div
              className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                transform: 'translateZ(50px)',
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Subtle Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="relative z-10">
                {/* From Currency */}
                <div className="mb-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block antialiased">You Send</label>
                  <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 hover:border-white/20 focus-within:border-white/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={fromAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setFromAmount(value);
                          }
                        }}
                        className="bg-transparent text-2xl font-semibold text-white placeholder:text-white/30 outline-none w-full antialiased [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="relative flex-shrink-0" ref={fromDropdownRef}>
                        <button
                          onClick={() => setShowFromDropdown(!showFromDropdown)}
                          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 pl-3 pr-3 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center p-1">
                            <Image
                              src={getCryptoIcon(fromCurrency)}
                              alt={fromCurrency}
                              width={20}
                              height={20}
                              className="w-full h-full"
                            />
                          </div>
                          <span>{fromCurrency}</span>
                          <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${showFromDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Custom Dropdown */}
                        {showFromDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                              {getAvailableFromCurrencies().map((currency) => (
                                <button
                                  key={currency}
                                  onClick={() => {
                                    setFromCurrency(currency);
                                    setShowFromDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                                    <Image
                                      src={getCryptoIcon(currency)}
                                      alt={currency}
                                      width={24}
                                      height={24}
                                      className="w-full h-full"
                                    />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-white font-semibold text-sm antialiased">{currency}</div>
                                    <div className="text-gray-500 text-xs antialiased">{getCryptoName(currency)}</div>
                                  </div>
                                  {rates[currency] && (
                                    <div className="text-xs text-gray-400 antialiased">${rates[currency].toLocaleString()}</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/40">USD Value</span>
                        <span className="text-xs font-semibold text-white/70">${getUsdValue(fromAmount, fromCurrency)}</span>
                      </div>
                      {rates[fromCurrency] && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white/40">Limits</span>
                          <span className="text-xs text-white/60 antialiased">
                            {getMinAmount(fromCurrency).toFixed(8)} - {getMaxAmount(fromCurrency).toFixed(8)} {fromCurrency}
                          </span>
                        </div>
                      )}
                      {amountError && (
                        <div className="text-xs text-red-400 antialiased pt-1">{amountError}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-0.5 relative z-10">
                  <button
                    onClick={handleSwap}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 active:scale-95 p-2 rounded-full transition-all group cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-white group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                </div>

                {/* To Currency */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block antialiased">You Receive</label>
                  <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={toAmount}
                        readOnly
                        className="bg-transparent text-2xl font-semibold text-white placeholder:text-white/30 outline-none w-full cursor-default antialiased"
                      />
                      <div className="relative flex-shrink-0" ref={toDropdownRef}>
                        <button
                          onClick={() => setShowToDropdown(!showToDropdown)}
                          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 pl-3 pr-3 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center p-1">
                            <Image
                              src={getCryptoIcon(toCurrency)}
                              alt={toCurrency}
                              width={20}
                              height={20}
                              className="w-full h-full"
                            />
                          </div>
                          <span>{toCurrency}</span>
                          <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${showToDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Custom Dropdown */}
                        {showToDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                              {getAvailableToCurrencies().map((currency) => (
                                <button
                                  key={currency}
                                  onClick={() => {
                                    setToCurrency(currency);
                                    setShowToDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                                    <Image
                                      src={getCryptoIcon(currency)}
                                      alt={currency}
                                      width={24}
                                      height={24}
                                      className="w-full h-full"
                                    />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-white font-semibold text-sm antialiased">{currency}</div>
                                    <div className="text-gray-500 text-xs antialiased">{getCryptoName(currency)}</div>
                                  </div>
                                  {rates[currency] && (
                                    <div className="text-xs text-gray-400 antialiased">${rates[currency].toLocaleString()}</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/40">USD Value</span>
                        <span className="text-xs font-semibold text-white/70">${getUsdValue(toAmount, toCurrency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receiving Address */}
                <div className="mb-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block antialiased">Receiving Address</label>
                  <div className="relative bg-white/5 border border-white/10 rounded-lg p-2.5 hover:border-white/20 focus-within:border-white/20 transition-all">
                    <input
                      type="text"
                      placeholder="Enter your wallet address"
                      value={receivingAddress}
                      onChange={(e) => setReceivingAddress(e.target.value)}
                      className="bg-transparent text-sm font-normal text-white placeholder:text-white/30 outline-none w-full antialiased"
                    />
                  </div>
                </div>

                {/* Refund Address */}
                <div className="mb-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block antialiased">Refund Address <span className="text-white/30 font-normal">(Optional)</span></label>
                  <div className="relative bg-white/5 border border-white/10 rounded-lg p-2.5 hover:border-white/20 focus-within:border-white/20 transition-all">
                    <input
                      type="text"
                      placeholder="Enter refund address"
                      className="bg-transparent text-sm font-normal text-white placeholder:text-white/30 outline-none w-full antialiased"
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div className="mb-3">
                  {!showReferralCode ? (
                    <button
                      onClick={() => setShowReferralCode(true)}
                      className="text-xs font-medium transition-colors flex items-center gap-1.5 antialiased cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg w-full justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold">Save 15% on fees</span>
                      </div>
                      <span className="text-blue-400/80">Enter code here →</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block antialiased">Referral Code</label>
                      <div className="relative bg-white/5 border border-white/10 rounded-lg p-2.5 hover:border-white/20 focus-within:border-white/20 transition-all">
                        <input
                          type="text"
                          placeholder="Enter referral code"
                          className="bg-transparent text-sm font-normal text-white placeholder:text-white/30 outline-none w-full antialiased"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-blue-400 mt-1.5 font-normal antialiased">15% discount on fees</p>
                    </motion.div>
                  )}
                </div>

                {/* Exchange Rate */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-4">
                  <div className="flex items-center justify-between antialiased">
                    <span className="text-white/50 font-medium text-sm">Rate</span>
                    <span className="text-white font-semibold text-sm">1 {fromCurrency} ≈ {getExchangeRate()} {toCurrency}</span>
                  </div>
                </div>

                {/* Fee Display */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-4">
                  <div className="flex items-center justify-between antialiased">
                    <span className="text-white/50 font-medium text-sm">Exchange Fee</span>
                    <span className="text-white font-semibold text-sm">2.00%</span>
                  </div>
                </div>

                {/* Exchange Button */}
                <button
                  disabled={!receivingAddress.trim() || !!amountError || !fromAmount}
                  className={`w-full py-3.5 rounded-xl transition-all text-base font-semibold shadow-lg ${
                    receivingAddress.trim() && !amountError && fromAmount
                      ? 'bg-white hover:bg-white/90 text-black shadow-white/10 active:scale-[0.98] cursor-pointer'
                      : 'bg-white/10 text-white/40 cursor-not-allowed shadow-none'
                  }`}
                >
                  Exchange
                </button>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Reserves Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white antialiased mb-2">Available Reserves</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 antialiased">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time liquidity updates</span>
            </div>
          </div>

          {/* Reserves Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(rates).map(([currency], index) => {
              // Mock reserve amounts - replace with actual data
              const reserveAmount = currency === 'XMR' ? '450.5' :
                                   currency === 'BTC' ? '12.5' :
                                   currency === 'LTC' ? '850' :
                                   currency === 'DASH' ? '1,200' :
                                   currency === 'ETH' ? '250.8' :
                                   currency === 'USDT-TRC20' ? '500,000' :
                                   currency === 'USDT-ERC20' ? '500,000' :
                                   '10,000';

              return (
                <motion.div
                  key={currency}
                  className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 hover:bg-black/50 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="relative">
                    {/* Crypto Icon - Centered */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image
                          src={getCryptoIcon(currency)}
                          alt={currency}
                          width={48}
                          height={48}
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    {/* Currency Name */}
                    <div className="text-center mb-4">
                      <div className="text-base font-bold text-white antialiased mb-0.5">{currency}</div>
                      <div className="text-xs text-gray-500 antialiased">{getCryptoName(currency)}</div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 mb-4"></div>

                    {/* Reserve Info */}
                    <div className="text-center space-y-2">
                      <div className="text-xl font-bold text-white antialiased">{reserveAmount}</div>
                      {rates[currency] && (
                        <div className="text-xs text-gray-500 antialiased">${rates[currency].toLocaleString()} USD</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Swaps & Popular Swaps Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-20 pt-6 sm:pt-10">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Quick Swaps */}
          <motion.div
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 antialiased">Quick Swaps</h2>
                <p className="text-xs text-gray-400 antialiased">One-click access to popular pairs</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { from: 'BTC', to: 'XMR' },
                  { from: 'ETH', to: 'BTC' },
                  { from: 'XMR', to: 'USDT-TRC20' },
                  { from: 'DASH', to: 'BTC' },
                  { from: 'LTC', to: 'ETH' },
                ].map((swap, index) => {
                  const rate = rates[swap.from] && rates[swap.to]
                    ? (rates[swap.from] / rates[swap.to]).toFixed(6)
                    : '0.000000';
                  return (
                  <motion.button
                    key={index}
                    className="w-full bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all group relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    onClick={() => {
                      setFromCurrency(swap.from);
                      setToCurrency(swap.to);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center p-1.5 ring-2 ring-black/50 shadow-lg">
                            <Image
                              src={getCryptoIcon(swap.from)}
                              alt={swap.from}
                              width={24}
                              height={24}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center p-1.5 ring-2 ring-black/50 shadow-lg">
                            <Image
                              src={getCryptoIcon(swap.to)}
                              alt={swap.to}
                              width={24}
                              height={24}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-base antialiased">{swap.from}</span>
                            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-white font-bold text-base antialiased">{swap.to}</span>
                          </div>
                          <div className="text-xs text-gray-400 antialiased">1 {swap.from} ≈ {rate} {swap.to}</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Popular Swaps */}
          <motion.div
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 antialiased">Popular Swaps</h2>
                    <p className="text-xs text-gray-400 antialiased">Trending pairs by volume</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 antialiased">24h Volume</div>
                    <div className="text-xs sm:text-sm font-bold text-white antialiased">$5.9M</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { from: 'BTC', to: 'XMR', volume: '2.4M', trend: '+12.5%', rank: 1 },
                  { from: 'ETH', to: 'BTC', volume: '1.8M', trend: '+8.3%', rank: 2 },
                  { from: 'XMR', to: 'USDT-TRC20', volume: '1.2M', trend: '+15.7%', rank: 3 },
                  { from: 'DASH', to: 'BTC', volume: '890K', trend: '+5.2%', rank: 4 },
                  { from: 'LTC', to: 'ETH', volume: '650K', trend: '+3.8%', rank: 5 },
                ].map((swap, index) => (
                  <motion.button
                    key={index}
                    className="w-full bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all group relative overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    onClick={() => {
                      setFromCurrency(swap.from);
                      setToCurrency(swap.to);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <span className="text-white/40 font-bold text-sm antialiased">#{swap.rank}</span>
                        </div>
                        <div className="flex items-center -space-x-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center p-1.5 ring-2 ring-black/50 shadow-lg">
                            <Image
                              src={getCryptoIcon(swap.from)}
                              alt={swap.from}
                              width={24}
                              height={24}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center p-1.5 ring-2 ring-black/50 shadow-lg">
                            <Image
                              src={getCryptoIcon(swap.to)}
                              alt={swap.to}
                              width={24}
                              height={24}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-base antialiased">{swap.from}</span>
                            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-white font-bold text-base antialiased">{swap.to}</span>
                          </div>
                          <div className="text-xs text-gray-400 antialiased">${swap.volume}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-400 antialiased">{swap.trend}</div>
                          <div className="text-xs text-gray-500 antialiased">24h</div>
                        </div>
                        <svg className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Premium Footer */}
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
    </div>
  );
}
