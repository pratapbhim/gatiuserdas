'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'
import AuthModal from '@/components/auth/AuthModal'
import UserProfileModal from '@/components/auth/UserProfileModal'

export default function Header() {
    // Search logic for landing page
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [restaurantList, setRestaurantList] = useState<any[]>([])
    const searchRef = useRef<HTMLDivElement>(null)

    // Fetch restaurant list on mount
    useEffect(() => {
      fetch('/api/restaurants')
        .then(res => res.json())
        .then(data => setRestaurantList(data || []))
        .catch(() => setRestaurantList([]));
    }, []);

    // Search handler
    const handleLandingSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      if (!value.trim()) {
        setSearchResults([])
        setSearchLoading(false)
        setShowSearchResults(false)
        return
      }
      setSearchLoading(true)
      setShowSearchResults(true)
      fetch(`/api/search?q=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data || [])
          setSearchLoading(false)
        })
        .catch(() => {
          setSearchResults([])
          setSearchLoading(false)
        })
    }

    // Close search results when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
          setShowSearchResults(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchPlaceholder, setSearchPlaceholder] = useState('')
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const phrases = [
    '🔍 Per Fast Delivery',
    '🔍 Explore Restaurant',
    '🔍 Book Your Parcel'
  ]

  useEffect(() => {
    let currentPhraseIndex = 0
    let currentCharIndex = 0
    let isTyping = true
    let timeoutId: NodeJS.Timeout

    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex]
      
      if (isTyping) {
        // Typing phase
        if (currentCharIndex <= currentPhrase.length) {
          setSearchPlaceholder(currentPhrase.substring(0, currentCharIndex))
          currentCharIndex++
          timeoutId = setTimeout(type, 70) // Speed of typing
        } else {
          // Wait 2 seconds before erasing
          timeoutId = setTimeout(() => {
            isTyping = false
            type()
          }, 2000)
        }
      } else {
        // Erasing phase
        if (currentCharIndex > 0) {
          currentCharIndex--
          setSearchPlaceholder(currentPhrase.substring(0, currentCharIndex))
          timeoutId = setTimeout(type, 50) // Speed of erasing
        } else {
          // Move to next phrase
          isTyping = true
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length
          currentCharIndex = 0
          timeoutId = setTimeout(type, 300) // Pause before next phrase
        }
      }
    }

    type()

    return () => clearTimeout(timeoutId)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBusinessDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isBusinessDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isBusinessDropdownOpen, isMobileMenuOpen])

  return (
    <>
      <div className="relative">
        {/* Main header with fixed gradient background */}
        <div className="absolute inset-0 rounded-b-[90px] overflow-hidden z-0">
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(22, 194, 165, 0.92), rgba(75, 42, 212, 0.95)), url("/img/bg.png") center/cover no-repeat'
            }}
          ></div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-sketch.png')] opacity-[0.08] pointer-events-none"></div>
        </div>
        
        {/* Header content */}
        <header className="text-white py-4 px-5 md:px-20 pb-[160px] rounded-b-[90px] relative z-10">
          {/* Navbar */}
          <div className="relative z-[100] max-w-[1400px] mx-auto bg-[rgba(255,255,255,0.95)] backdrop-blur-[16px] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-4 md:px-[28px] py-3 md:py-[14px] mb-[24px]">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                {/* Logo Icon */}
                <div className="relative flex-shrink-0 logo-blink">
                  <img 
                    src="/img/logo.png" 
                    alt="GatiMitra Logo" 
                    className="h-8 md:h-12 w-auto object-contain"
                  />
                </div>
                {/* Logo Text */}
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-xl md:text-3xl font-black text-[#16c2a5] leading-tight">Gati</span>
                    <span className="text-xl md:text-3xl font-black text-[#ff6b35] leading-tight">Mitra</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-semibold text-text-light tracking-[1.5px] uppercase mt-0.5">
                    Moving India Forward
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-6 items-center">
                <Link href="/about" className="text-text no-underline font-medium text-[14px] px-3 py-2 rounded-lg transition-all duration-200 relative flex items-center gap-1.5 hover:text-purple hover:bg-[rgba(75,42,212,0.08)]">
                  <i className="fas fa-info-circle text-[13px]"></i> About
                </Link>
                <Link href="#" className="text-text no-underline font-medium text-[14px] px-3 py-2 rounded-lg transition-all duration-200 relative flex items-center gap-1.5 hover:text-purple hover:bg-[rgba(75,42,212,0.08)]">
                  <i className="fas fa-map-marker-alt text-[13px]"></i> Around You
                </Link>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                    className="text-text no-underline font-medium text-[14px] px-3 py-2 rounded-lg transition-all duration-200 relative flex items-center gap-1.5 hover:text-purple hover:bg-[rgba(75,42,212,0.08)] bg-transparent border-none cursor-pointer"
                  >
                    <i className="fas fa-briefcase text-[13px]"></i> Business
                    <span className={`text-[9px] ml-1 transition-transform duration-200 ${isBusinessDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isBusinessDropdownOpen && (
                    <div className="absolute top-11 left-0 bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] min-w-[240px] overflow-hidden z-[200] py-2 animate-fadeIn" style={{ border: '1px solid rgba(22,194,165,0.1)' }}>
                      <Link 
                        href="/register" 
                        onClick={() => setIsBusinessDropdownOpen(false)}
                        className="block px-5 py-3 text-gray-700 no-underline font-medium text-[14px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                      >
                        <i className="fas fa-store mr-2 text-[13px]"></i> Register as Merchant
                      </Link>
                      <Link 
                        href="#" 
                        onClick={() => setIsBusinessDropdownOpen(false)}
                        className="block px-5 py-3 text-gray-700 no-underline font-medium text-[14px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                      >
                        <i className="fas fa-tag mr-2 text-[13px]"></i> Register as Brand
                      </Link>
                      <Link 
                        href="#" 
                        onClick={() => setIsBusinessDropdownOpen(false)}
                        className="block px-5 py-3 text-gray-700 no-underline font-medium text-[14px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                      >
                        <i className="fas fa-building mr-2 text-[13px]"></i> GatiMitra for Corporates
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="#" className="text-text no-underline font-medium text-[14px] px-3 py-2 rounded-lg transition-all duration-200 relative flex items-center gap-1.5 hover:text-purple hover:bg-[rgba(75,42,212,0.08)]">
                  <i className="fas fa-mobile-alt text-[13px]"></i> Get App
                </Link>

                {isAuthenticated && user ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Profile button clicked')
                      setIsProfileModalOpen(true)
                    }}
                    className="bg-gradient-to-br from-purple to-[#6a3aff] text-white px-6 py-2.5 rounded-xl font-semibold text-[14px] transition-all duration-200 shadow-[0_4px_16px_rgba(75,42,212,0.25)] hover:shadow-[0_6px_20px_rgba(75,42,212,0.35)] hover:-translate-y-0.5 relative overflow-hidden z-50"
                    type="button"
                  >
                    <i className="fas fa-user-circle mr-1.5 text-[13px]"></i>
                    {user.name || user.phone}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Auth button clicked, opening modal')
                      setIsAuthModalOpen(true)
                    }}
                    className="bg-gradient-to-br from-purple to-[#6a3aff] text-white px-6 py-2.5 rounded-xl font-semibold text-[14px] transition-all duration-200 shadow-[0_4px_16px_rgba(75,42,212,0.25)] hover:shadow-[0_6px_20px_rgba(75,42,212,0.35)] hover:-translate-y-0.5 relative overflow-hidden cursor-pointer z-50"
                    type="button"
                  >
                    <i className="fas fa-user-circle mr-1.5 text-[13px]"></i> Sign In / Up
                  </button>
                )}
              </nav>

              {/* Mobile Hamburger Menu */}
              <div className="md:hidden relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-text p-2 rounded-lg hover:bg-[rgba(75,42,212,0.08)] transition-all"
                  aria-label="Toggle menu"
                >
                  <div className="w-6 h-5 flex flex-col justify-between">
                    <span className={`block h-0.5 w-full bg-text transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-text transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-text transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                  </div>
                </button>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                  <div className="absolute top-12 right-0 bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] min-w-[280px] overflow-hidden z-[200] py-3 animate-fadeIn border border-gray-100">
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-home mr-3 text-[14px] text-purple"></i> Home
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-info-circle mr-3 text-[14px] text-purple"></i> About
                    </Link>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-map-marker-alt mr-3 text-[14px] text-purple"></i> Around You
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-store mr-3 text-[14px] text-purple"></i> Register as Merchant
                    </Link>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-tag mr-3 text-[14px] text-purple"></i> Register as Brand
                    </Link>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-building mr-3 text-[14px] text-purple"></i> GatiMitra for Corporates
                    </Link>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-3 text-gray-700 no-underline font-medium text-[15px] transition-all hover:bg-gradient-to-r hover:from-[rgba(22,194,165,0.08)] hover:to-[rgba(75,42,212,0.05)] hover:text-purple"
                    >
                      <i className="fas fa-mobile-alt mr-3 text-[14px] text-purple"></i> Get App
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    {isAuthenticated && user ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsMobileMenuOpen(false)
                          setIsProfileModalOpen(true)
                        }}
                        className="w-full px-5 py-3 text-left"
                        type="button"
                      >
                        <div className="text-gray-700 font-medium text-[15px] flex items-center gap-3 hover:text-purple transition-colors">
                          <i className="fas fa-user-circle text-[14px] text-purple"></i>
                          {user.name || user.phone}
                          <i className="fas fa-chevron-right text-[10px] text-gray-400 ml-auto"></i>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsMobileMenuOpen(false)
                          setIsAuthModalOpen(true)
                        }}
                        className="w-[calc(100%-2.5rem)] mx-5 mb-3 bg-gradient-to-br from-purple to-[#6a3aff] text-white px-6 py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 shadow-[0_4px_16px_rgba(75,42,212,0.25)] hover:shadow-[0_6px_20px_rgba(75,42,212,0.35)]"
                        type="button"
                      >
                        <i className="fas fa-user-circle mr-2"></i> Sign In / Up
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="hero-section relative">
            {/* Left Arrow - Higher Position */}
            <svg className="absolute pointer-events-none arrow-blink" width="200" height="300" viewBox="0 0 200 300" style={{left: '-50px', top: '70px', filter: 'drop-shadow(0 0 12px #00e5ff)', animationDelay: '0s'}}>
              <defs>
                <linearGradient id="arrowGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#0099ff" />
                </linearGradient>
              </defs>
              <path d="M 40 50 L 80 100 L 40 150" stroke="url(#arrowGradLeft)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 80 L 140 130 L 100 180" stroke="url(#arrowGradLeft)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            </svg>
            
            {/* Right Arrow - Higher Position */}
            <svg className="absolute pointer-events-none arrow-blink" width="200" height="300" viewBox="0 0 200 300" style={{right: '-50px', top: '70px', filter: 'drop-shadow(0 0 12px #00e5ff)', animationDelay: '0.5s'}}>
              <defs>
                <linearGradient id="arrowGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#0099ff" />
                </linearGradient>
              </defs>
              <path d="M 160 50 L 120 100 L 160 150" stroke="url(#arrowGradRight)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 80 L 60 130 L 100 180" stroke="url(#arrowGradRight)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            </svg>

            {/* Blinking Background Logos */}
            <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-around px-10" style={{zIndex: 1}}>
              <div className="hero-logo-blink" style={{animationDelay: '0s'}}>
                <img src="/img/logo.png" alt="logo" className="h-24 w-auto opacity-50" />
              </div>
              <div className="hero-logo-blink" style={{animationDelay: '0.4s'}}>
                <img src="/img/logo.png" alt="logo" className="h-20 w-auto opacity-40" />
              </div>
              <div className="hero-logo-blink" style={{animationDelay: '0.8s'}}>
                <img src="/img/logo.png" alt="logo" className="h-28 w-auto opacity-45" />
              </div>
              <div className="hero-logo-blink" style={{animationDelay: '1.2s'}}>
                <img src="/img/logo.png" alt="logo" className="h-22 w-auto opacity-35" />
              </div>
            </div>

            <h1 className="hero-title relative z-10">
              India&apos;s <span className="hero-title-accent">Lowest Commission</span>
              <br />Delivery Platform
            </h1>
            <p className="hero-subtitle relative z-10">
              Food • Parcel • Person Delivery
            </p>

            {/* Search Box */}
            <div className="relative max-w-[800px] mx-auto" ref={searchRef}>
              <div className="search-box search-box-responsive">
                {/* Location input */}
                <input
                  className="location-input location-input-responsive"
                  placeholder="📍 Detecting location…"
                  readOnly
                />
                {/* Search input with typing animation and logic */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="search-input search-input-responsive"
                    value={searchQuery}
                    onChange={handleLandingSearchInput}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                    style={{width:'100%'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Search Results Container - Positioned below header */}
        {showSearchResults && searchQuery && (
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[800px] z-50" style={{ top: 'calc(100% - 40px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {searchLoading && (
                <div className="px-6 py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple mb-4"></div>
                  <div className="text-gray-500">Searching for "{searchQuery}"...</div>
                </div>
              )}
              {!searchLoading && searchResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="px-6 py-4 bg-gradient-to-r from-purple-light to-blue-50 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-text text-lg">Search Results</h3>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full font-medium">
                        {searchResults.length} results found
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Showing results for "{searchQuery}"</div>
                  </div>
                  {searchResults.map((item, idx) => {
                    const restaurant = restaurantList.find(r => r.restaurant_id === item.restaurant_id || r.id === item.restaurant_id);
                    const restaurantName = restaurant ? (restaurant.restaurant_name || restaurant.name) : 'Unknown Restaurant';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-purple-light/30 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.item_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="text-2xl text-gray-400">🍽️</div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-text text-base truncate group-hover:text-purple transition-colors">
                                {item.item_name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-purple font-semibold text-sm cursor-pointer hover:text-purple-dark hover:underline transition-all">
                                  {restaurantName}
                                </span>
                                {item.category && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.price && (
                              <div className="text-green-600 font-bold text-lg whitespace-nowrap">
                                ₹{item.price}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            {item.category_item && (
                              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                {item.category_item}
                              </span>
                            )}
                            {typeof item.score !== 'undefined' && (
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                item.score === 100 
                                  ? 'bg-green-100 text-green-700' 
                                  : item.score >= 80
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                Match: {item.score}%
                              </span>
                            )}
                            {item.delivery_time && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <i className="fas fa-clock text-xs"></i>
                                {item.delivery_time} min
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-gradient-to-r from-purple to-[#6a3aff] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
                            Order Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {!searchLoading && searchResults.length === 0 && searchQuery && (
                <div className="px-6 py-12 text-center">
                  <div className="text-5xl mb-4 text-gray-300">🔍</div>
                  <div className="text-gray-600 font-semibold text-lg mb-2">No results found for "{searchQuery}"</div>
                  <div className="text-gray-400 text-sm max-w-md mx-auto">
                    Try different keywords, check spelling, or browse categories
                  </div>
                  <button 
                    onClick={() => setShowSearchResults(false)}
                    className="mt-4 text-purple font-medium text-sm hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}