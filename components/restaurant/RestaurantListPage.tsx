"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

// Add CSS for blinking animation
const styleSheet = typeof document !== 'undefined' ? (() => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse-blink {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
      }
      50% {
        opacity: 0.8;
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
      }
    }
    .pulse-attention {
      animation: pulse-blink 2s infinite;
    }
  `
  if (document.head) {
    document.head.appendChild(style)
  }
  return style
})() : null

interface RestaurantCard {
  id: string
  name: string
  cuisines: string[]
  rating: number
  reviews: number
  deliveryTime: number
  deliveryFee: number
  image: string
  isVeg?: boolean
  discount?: number
  fssaiLicense: string
  category?: string
  is_active?: boolean
  opening_time?: string
  closing_time?: string
}

// Updated NotFound Component with improved layout
const NotFound = ({ 
  message, 
  description, 
  buttonText, 
  onButtonClick 
}: { 
  message: string; 
  description: string; 
  buttonText: string; 
  onButtonClick: () => void 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left side - Image with increased height */}
        <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/img/wrong.png" // Your public image path
            alt="Wrong turn illustration"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Right side - Content with reduced text area */}
        <div className="text-center md:text-left space-y-6">
          {/* "Oops" at top with smaller text size */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Oops,
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {message}
            </h1>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {description}
          </p>
          
          <div className="space-y-4 pt-4">
            <button
              onClick={onButtonClick}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-2xl text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              <span>{buttonText}</span>
              <i className="fas fa-arrow-right text-xl"></i>
            </button>
            
            <p className="text-gray-500 text-sm italic">
              Let's explore other amazing restaurants in your city!
            </p>
          </div>
          
          {/* Additional decorative elements */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-store text-green-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Local Stores</span>
                  <span className="text-xs text-gray-500">Near you</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-bolt text-blue-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Fast Delivery</span>
                  <span className="text-xs text-gray-500">Minutes away</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-star text-purple-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Top Rated</span>
                  <span className="text-xs text-gray-500">Quality assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Updated 404 Page Component with new layout
const NotFound404 = () => {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left side - Image with increased height */}
        <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/img/wrong.png"
            alt="Wrong turn illustration"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Right side - Content with reduced text area */}
        <div className="text-center md:text-left space-y-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Oops,
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Wrong Way!
            </h1>
            <div className="text-8xl md:text-9xl font-black text-gray-900 opacity-10 -mt-6 -mb-4">
              404
            </div>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Looks like you're off the route!
            Let's take you back to GatiMitra—discover nearby stores and get food, parcels, or rides in minutes.
          </p>
          
          <div className="space-y-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              <span>Back to GatiMitra</span>
              <i className="fas fa-home text-xl"></i>
            </button>
            
            <p className="text-gray-500 text-sm italic">
              Discover your city & experience the joy of shopping at local stores
            </p>
          </div>
          
          {/* Additional decorative elements */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-store text-green-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Local Stores</span>
                  <span className="text-xs text-gray-500">Near you</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-shipping-fast text-blue-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Fast Delivery</span>
                  <span className="text-xs text-gray-500">Minutes away</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-star text-purple-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Top Rated</span>
                  <span className="text-xs text-gray-500">Quality assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RestaurantListPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [localVegOnly, setLocalVegOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'name'>('rating')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  // Fetch real restaurant data from API
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    let url = '/api/restaurants';
    if (selectedCategory) {
      url = `/api/restaurants/by-category?category=${encodeURIComponent(selectedCategory)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRestaurants(
          (data || []).map((r: any) => ({
            id: r.restaurant_id ? r.restaurant_id.toString() : '',
            name: r.restaurant_name ?? '',
            cuisines: r.cuisine_type ? r.cuisine_type.split(',').map((c: string) => c.trim()) : [],
            rating: r.avg_rating ?? '',
            reviews: r.total_reviews ?? '',
            deliveryTime: r.delivery_time_minutes ?? '',
            deliveryFee: r.delivery_fee ?? '',
            image: r.store_img ?? '',
            isVeg: r.is_veg ?? false,
            discount: r.discount ?? '',
            fssaiLicense: r.fssai_license ?? '',
            category: r.category ?? '',
            is_active: r.is_active ?? true,
            opening_time: r.opening_time ?? '',
            closing_time: r.closing_time ?? '',
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load restaurants');
        setLoading(false);
      });
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
          <NotFound 
            message="Looks like you're off the route!!" 
            description="Let's take you back to GatiMitra—discover nearby stores and get food, parcels, or rides in minutes." 
            buttonText="Push me to GatiMitra!" 
            onButtonClick={() => window.location.href = '/order'}
          />
      );
  }

  const filteredRestaurants = restaurants.filter(r => {
    const vegMatch = !localVegOnly || r.isVeg
    return vegMatch
  })

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'delivery':
        return a.deliveryTime - b.deliveryTime
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f9fafb] to-[#f3f4f6] flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-80 bg-white border-r border-[#e9ecef] fixed left-0 top-14 h-[calc(100vh-3.5rem)] flex-col p-6 overflow-y-auto">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3">
            {selectedCategory && (
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-1 text-[#16c2a5] hover:text-[#0fa589] font-bold text-sm transition-colors cursor-pointer hover:bg-[#f0fdfb] px-2 py-1 rounded"
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
            )}
            {/* Veg Toggle in Title */}
            <button
              onClick={() => setLocalVegOnly(!localVegOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                localVegOnly
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-leaf text-sm"></i>
              {localVegOnly ? 'Veg Only' : 'All'}
            </button>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A2E] mb-2">
            {selectedCategory ? `${selectedCategory}` : 'All Restaurants'}
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            <i className="fas fa-check-circle text-green-600 mr-1.5"></i>
            {sortedRestaurants.length} available
          </p>
        </div>

        {/* Filters Section */}
        <div className="space-y-6">
          {/* Veg Toggle */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Cuisine Type</p>
            <button
              onClick={() => setLocalVegOnly(!localVegOnly)}
              className={`w-full inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                localVegOnly
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 pulse-attention'
              }`}
            >
              <i className="fas fa-leaf text-lg"></i>
              <span>{localVegOnly ? 'Veg Only' : 'All Cuisines'}</span>
            </button>
          </div>

          {/* Sort Options */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Sort By</p>
            <div className="space-y-2">
              {(['rating', 'delivery', 'name'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all text-left ${
                    sortBy === option
                      ? 'bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white shadow-lg'
                      : 'bg-white border-2 border-[#e9ecef] text-gray-700 hover:border-[#16c2a5] hover:text-[#16c2a5]'
                  }`}
                >
                  {option === 'rating' && '⭐ Highest Rating'}
                  {option === 'delivery' && '⚡ Fastest Delivery'}
                  {option === 'name' && '📝 A - Z'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:ml-80 pt-4">
        {/* Mobile Header - Only visible on small screens */}
        <div className="lg:hidden bg-white shadow-md border-b border-[#e9ecef] sticky top-14 z-20 px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A2E]">
                {selectedCategory ? `${selectedCategory}` : 'Restaurants'}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {sortedRestaurants.length} available
              </p>
            </div>
            <button
              onClick={() => setLocalVegOnly(!localVegOnly)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                localVegOnly
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <i className="fas fa-leaf"></i>
              {localVegOnly ? 'Veg' : 'All'}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['rating', 'delivery', 'name'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  sortBy === option
                    ? 'bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white'
                    : 'bg-white border-2 border-[#e9ecef] text-gray-700'
                }`}
              >
                {option === 'rating' && '⭐'}
                {option === 'delivery' && '⚡'}
                {option === 'name' && '📝'}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {sortedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {sortedRestaurants.map((restaurant) => {
              // Determine open/closed status
              const now = new Date();
              let isOpen = true;
              let nextOpenMsg = '';
              if (restaurant.is_active === false) {
                isOpen = false;
              } else if (restaurant.opening_time && restaurant.closing_time) {
                const [oh, om] = restaurant.opening_time.split(':').map(Number);
                const [ch, cm] = restaurant.closing_time.split(':').map(Number);
                const openTime = new Date(now); openTime.setHours(oh, om || 0, 0, 0);
                const closeTime = new Date(now); closeTime.setHours(ch, cm || 0, 0, 0);
                if (closeTime <= openTime) closeTime.setDate(closeTime.getDate() + 1); // overnight
                if (now < openTime) {
                  isOpen = false;
                  nextOpenMsg = `Opens at ${restaurant.opening_time}`;
                } else if (now > closeTime) {
                  isOpen = false;
                  nextOpenMsg = `Opens at ${restaurant.opening_time} (tomorrow)`;
                }
              }
              return (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.id}`}
                  className="group block no-underline h-full"
                >
                  <div className="h-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-4 border border-gray-200 hover:border-[#16c2a5]">
                    {/* Image Section - Fixed Height with Better Badge Layout */}
                    <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        priority={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      />
                      {/* Top Badge Area */}
                      <div className="absolute inset-0 top-0 pt-4 px-4 flex justify-between items-start pointer-events-none">
                        {/* Left: Veg Badge */}
                        {restaurant.isVeg && (
                          <div className="bg-white px-3 py-1.5 rounded-full text-green-700 font-bold text-xs shadow-lg flex items-center gap-1.5 border border-green-300 pointer-events-auto">
                            <div className="w-2.5 h-2.5 bg-green-700 rounded-full"></div>
                            Pure Veg
                          </div>
                        )}
                        {/* Open/Closed Badge */}
                        <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 pointer-events-auto border ${isOpen ? 'bg-green-500 text-white border-green-600' : 'bg-gray-300 text-gray-700 border-gray-400'}`}>
                          <i className={`fas ${isOpen ? 'fa-door-open' : 'fa-door-closed'}`}></i>
                          {isOpen ? 'Open' : 'Closed'}
                        </div>
                        {/* Right: Discount Badge */}
                        {restaurant.discount && (
                          <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1 pointer-events-auto">
                            <i className="fas fa-fire text-white text-sm"></i>
                            {restaurant.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Bottom: Rating Badge */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-start p-3">
                        <div className="bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg">
                          <i className="fas fa-star text-white text-sm"></i>
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                      {/* Closed message overlay */}
                      {!isOpen && nextOpenMsg && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                          <div className="bg-white/90 text-gray-900 px-6 py-4 rounded-2xl shadow-xl text-center max-w-xs">
                            <div className="font-bold text-lg mb-2">Currently Closed</div>
                            <div className="text-sm">{nextOpenMsg}<br/>You can place an order once the restaurant opens.</div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Content Section - More Spacious */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      {/* Header with name and cuisine */}
                      <div className="mb-4">
                        <h3 className="font-black text-base text-[#1A1A2E] group-hover:text-[#16c2a5] transition-colors line-clamp-2 mb-2">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-1 font-medium">
                          {restaurant.cuisines.join(', ')}
                        </p>
                      </div>

                      {/* Reviews Count */}
                      <div className="mb-4 pb-4 border-b border-gray-150">
                        <p className="text-xs text-gray-700 font-semibold flex items-center gap-2">
                          <span className="text-[#ff6b35] text-sm">★</span>
                          <span className="text-[#1A1A2E] font-bold">{restaurant.reviews?.toLocaleString?.() ?? restaurant.reviews}</span>
                          <span className="text-gray-500">ratings</span>
                        </p>
                      </div>

                      {/* FSSAI License - Trust Builder */}
                      {restaurant.fssaiLicense && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 mb-4">
                          <div className="text-green-700 font-black text-xs flex items-center gap-2">
                            <i className="fas fa-certificate text-green-600 text-sm"></i>
                            <span>FSSAI Verified</span>
                          </div>
                          <p className="text-green-700 font-mono text-[8px] mt-1.5 truncate">{restaurant.fssaiLicense}</p>
                        </div>
                      )}

                      {/* Delivery Info - Bottom Section */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                        {/* Delivery Time */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#16c2a5] to-[#0fa589] flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-clock text-white text-xs"></i>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-[#1A1A2E]">{restaurant.deliveryTime}m</span>
                            <span className="text-[8px] text-gray-500">Delivery</span>
                          </div>
                        </div>

                        {/* Delivery Fee */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8451] flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-rupee-sign text-white text-xs"></i>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-[#1A1A2E]">₹{restaurant.deliveryFee}</span>
                            <span className="text-[8px] text-gray-500">Fee</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <NotFound 
            message="Looks like you're off the route!!" 
            description="Let's take you back to GatiMitra—discover nearby stores and get food, parcels, or rides in minutes." 
            buttonText="Push me to GatiMitra!" 
            onButtonClick={() => window.location.href = '/order'}
          />
        )}
      </div>
      </div>
    </div>
  )
}

export default RestaurantListPage
export { NotFound404 }