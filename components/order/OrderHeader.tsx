'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import Search from '@/components/common/Search'
import AuthModal from '@/components/auth/AuthModal'

interface OrderHeaderProps {
  cartCount?: number
  onCartClick?: () => void
}

export default function OrderHeader({ cartCount = 0, onCartClick }: OrderHeaderProps) {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('Detecting location...')
  const [isDetecting, setIsDetecting] = useState(true)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = () => {
    setIsDetecting(true)
    const popularLocations = [
      'Rajouri Garden, New Delhi',
      'Connaught Place, New Delhi',
      'Sector 12, Dwarka',
      'Mayur Vihar Phase 1',
      'East Delhi, Shahdara',
      'South Delhi, Vasant Vihar',
      'North Delhi, Model Town'
    ]
    
    // Simulate location detection
    setTimeout(() => {
      const detectedLocation = popularLocations[Math.floor(Math.random() * popularLocations.length)]
      setCurrentLocation(detectedLocation)
      setIsDetecting(false)
    }, 1000)
  }

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation)
    setShowLocationModal(false)
  }

  return (
    <>
      {/* Main Header with GatiMitra Branding */}
      <header className="bg-gradient-to-r from-white via-[#f8f9fa] to-white shadow-md sticky top-0 z-[1000] border-b border-[#e9ecef]">
        {/* Navbar Bar */}
        <div className="py-1 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center gap-2 md:gap-2">
              {/* Logo Section - Matching Landing Page */}
              <Link href="/" className="flex items-center gap-1 md:gap-1.5 shrink-0 group">
                {/* Logo Icon */}
                <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <div className="h-6 md:h-7 w-6 md:w-7 bg-gradient-to-br from-[#16c2a5] to-[#0fa589] rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md">
                    G
                  </div>
                </div>
                {/* Logo Text */}
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-0 leading-none">
                    <span className="text-xs md:text-sm font-black text-[#16c2a5]">Gati</span>
                    <span className="text-xs md:text-sm font-black text-[#ff6b35]">Mitra</span>
                  </div>
                  <span className="text-[4px] md:text-[6px] font-semibold text-[#6C757D] tracking-[0.5px] uppercase leading-none">
                    Food
                  </span>
                </div>
              </Link>

              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs md:text-sm transition-all"
              >
                <i className="fas fa-arrow-left text-xs md:text-sm"></i>
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Quick Nav - All Restaurants Link */}
              <Link 
                href="/restaurants" 
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white font-semibold text-[10px] hover:shadow-lg transition-all group"
              >
                <i className="fas fa-utensils group-hover:scale-110 transition-transform"></i>
                <span className="hidden md:inline">All Restaurants</span>
                <span className="md:hidden">Restaurants</span>
              </Link>

              {/* Desktop - Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-[500px] relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6C757D] transition-colors group-focus-within:text-[#16c2a5]">
                  <i className="fas fa-search text-[10px]"></i>
                </div>
                <Search
                  placeholder="Search restaurants, cuisines, dishes..."
                  className="w-full pl-8 pr-3 py-1 rounded-full border-2 border-[#e9ecef] text-[11px] bg-white transition-all focus:outline-none focus:border-[#16c2a5] focus:shadow-[0_0_0_3px_rgba(22,194,165,0.1)]"
                />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-1 md:gap-1.5">
                {/* Location - Desktop Only */}
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="hidden md:flex items-center gap-0.5 bg-gradient-to-r from-[#f0f0f0] to-[#f8f9fa] px-2 py-1 rounded-full cursor-pointer transition-all hover:from-[#e9ecef] hover:to-[#f0f0f0] group text-[10px]"
                >
                  <i className="fas fa-map-marker-alt text-[#ff6b35] text-[10px] group-hover:scale-110 transition-transform"></i>
                  <div className="font-bold text-[#1A1A2E] text-[10px] truncate max-w-[120px]">
                    {isDetecting ? '🔍 Detecting...' : currentLocation}
                  </div>
                </button>

                {/* User/Auth */}
                {isAuthenticated && user ? (
                  <div className="hidden sm:block bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white px-2 py-1 rounded-full font-semibold text-[10px] transition-all hover:shadow-lg hover:-translate-y-0.5 truncate max-w-[80px]">
                    👤 {user.name ? user.name.split(' ')[0] : user.phone}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hidden sm:block bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white px-2 py-1 rounded-full font-semibold text-[10px] transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Sign In
                  </button>
                )}

                {/* Cart */}
                <button
                  onClick={onCartClick}
                  className="relative bg-gradient-to-br from-[#f0f0f0] to-[#e9ecef] text-[#1A1A2E] w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:from-[#16c2a5] hover:to-[#0fa589] hover:text-white hover:shadow-lg text-[10px] font-semibold group"
                >
                  <i className="fas fa-shopping-cart group-hover:scale-110 transition-transform"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="md:hidden flex flex-col gap-0.5 p-1 hover:bg-[#f0f0f0] rounded-lg transition-all"
                >
                  <span className={`w-3.5 h-0.5 bg-[#1A1A2E] transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`w-3.5 h-0.5 bg-[#1A1A2E] transition-all duration-300 ${showMenu ? 'opacity-0' : ''}`}></span>
                  <span className={`w-3.5 h-0.5 bg-[#1A1A2E] transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden relative mt-1">
              <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6C757D] text-[10px]"></i>
              <Search
                placeholder="Search restaurants..."
                className="w-full pl-9 pr-3 py-1 rounded-full border-2 border-[#e9ecef] text-[11px] bg-white transition-all focus:outline-none focus:border-[#16c2a5]"
              />
            </div>

            {/* Mobile Menu */}
            {showMenu && (
              <div className="md:hidden bg-white border-t border-[#e9ecef] mt-1 pt-1.5 pb-1.5 -mx-4 px-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <button 
                    onClick={() => {
                      setShowLocationModal(true)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-1.5 bg-gradient-to-r from-[#f0f0f0] to-[#f8f9fa] px-2.5 py-1.5 rounded-full cursor-pointer transition-all hover:from-[#e9ecef] hover:to-[#f0f0f0]"
                  >
                    <i className="fas fa-map-marker-alt text-[#ff6b35] text-[10px]"></i>
                    <span className="text-[10px] font-bold text-[#1A1A2E] truncate flex-1">
                      {isDetecting ? '🔍 Detecting...' : currentLocation}
                    </span>
                    <i className="fas fa-chevron-right text-[#ff6b35] text-[8px]"></i>
                  </button>
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setShowMenu(false)
                      }}
                      className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white px-2.5 py-1.5 rounded-full font-semibold text-[10px] transition-all hover:shadow-lg"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end md:items-center md:justify-center" onClick={() => setShowLocationModal(false)}>
          <div 
            className="bg-white w-full md:w-96 md:rounded-2xl rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-4 md:slide-in-from-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white p-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-sm">Select Location</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-xl">✕</button>
            </div>

            <div className="p-3 space-y-3">
              {/* Detect Location Button */}
              <button
                onClick={detectLocation}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 p-2.5 rounded-xl text-[11px] font-semibold text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all"
              >
                <i className="fas fa-redo-alt text-blue-700"></i>
                {isDetecting ? 'Detecting your location...' : 'Detect automatically'}
              </button>

              {/* Current Location Display */}
              {!isDetecting && (
                <div className="bg-green-50 border border-green-300 p-2.5 rounded-xl text-[10px]">
                  <div className="text-green-700 font-semibold flex items-center gap-1.5">
                    <i className="fas fa-check-circle text-green-600"></i>
                    Current Location
                  </div>
                  <div className="text-green-900 font-bold mt-1">{currentLocation}</div>
                </div>
              )}

              {/* Manual Location Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700">Enter Location Manually</label>
                <input
                  type="text"
                  placeholder="Search for location or address..."
                  defaultValue={currentLocation}
                  className="w-full px-2.5 py-2 border border-gray-300 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (value) {
                        handleLocationChange(value)
                      }
                    }
                  }}
                />
              </div>

              {/* Popular Locations */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700">Popular Locations</label>
                <div className="space-y-1.5">
                  {[
                    'Rajouri Garden, New Delhi',
                    'Connaught Place, New Delhi',
                    'Sector 12, Dwarka',
                    'Mayur Vihar Phase 1',
                    'East Delhi, Shahdara',
                    'South Delhi, Vasant Vihar',
                    'North Delhi, Model Town'
                  ].map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationChange(location)}
                      className={`w-full p-2 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-2 ${
                        currentLocation === location
                          ? 'bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className="fas fa-map-pin"></i>
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white p-2.5 rounded-xl font-semibold text-[11px] hover:shadow-lg transition-all mt-2"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}