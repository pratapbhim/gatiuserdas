'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { CartItem } from './OrderPage'
import AuthModal from '@/components/auth/AuthModal'

interface CategoriesSectionProps {
  onViewRestaurants: () => void
  vegOnly: boolean
  onAddToCart?: (item: CartItem) => void
}

interface PriceCard {
  id: string
  price: number
  title: string
  desc: string
  image: string
  priceRange: [number, number]
}

interface RestaurantWithItems {
  id: number
  name: string
  image: string
  items: Array<{ name: string; price: number; image: string }>
}

export default function CategoriesSection({ onViewRestaurants, vegOnly, onAddToCart }: CategoriesSectionProps) {
  const router = useRouter()
  const [selectedPriceCard, setSelectedPriceCard] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState('Detecting...')
  const [isDetecting, setIsDetecting] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [categoryPage, setCategoryPage] = useState(0)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const cartItems = useAppSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = () => {
    setIsDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const address = data.address
            const location = address.suburb || address.neighbourhood || address.city || address.town || 'Unknown'
            const city = address.city || address.town || address.state || ''
            setCurrentLocation(`${location}, ${city}`)
            setIsDetecting(false)
          } catch {
            setCurrentLocation('Delhi, India')
            setIsDetecting(false)
          }
        },
        () => {
          setCurrentLocation('Delhi, India')
          setIsDetecting(false)
        }
      )
    } else {
      setCurrentLocation('Delhi, India')
      setIsDetecting(false)
    }
  }

  const priceCards: PriceCard[] = [
    {
      id: 'budget',
      price: 99,
      title: "Budget Meals",
      desc: "Delicious meals under ₹99",
      image: "/img/street food.png",
      priceRange: [0, 99]
    },
    {
      id: 'mid',
      price: 149,
      title: "Value Meals",
      desc: "Great food at ₹100-₹149",
      image: "/img/burger.png",
      priceRange: [100, 149]
    },
    {
      id: 'premium',
      price: 199,
      title: "Premium Delights",
      desc: "Quality dishes at ₹150-₹199",
      image: "/img/pizza.png",
      priceRange: [150, 199]
    },
    {
      id: 'feast',
      price: 249,
      title: "Feast Special",
      desc: "Larger portions at ₹200-₹249",
      image: "/img/thali.png",
      priceRange: [200, 249]
    },
    {
      id: 'luxury',
      price: 299,
      title: "Luxury Dishes",
      desc: "Premium items at ₹250-₹299",
      image: "/img/biryani.png",
      priceRange: [250, 299]
    },
    {
      id: 'gourmet',
      price: 399,
      title: "Gourmet",
      desc: "Fine dining items ₹300+",
      image: "/img/desserts.png",
      priceRange: [300, 500]
    },
  ]

  // Mock restaurant items data - in real app, this would come from API
  const restaurantItems: Record<string, RestaurantWithItems[]> = {
    budget: [
      {
        id: 1,
        name: "Delhi Darbar Dhaba",
        image: "/img/street food.png",
        items: [
          { name: "Plain Naan", price: 40, image: "/img/northindian.png" },
          { name: "Chole Bhature", price: 80, image: "/img/thali.png" },
          { name: "Aloo Paratha", price: 70, image: "/img/northindian.png" },
        ]
      },
    ],
    mid: [
      {
        id: 2,
        name: "Burger King",
        image: "/img/burger.png",
        items: [
          { name: "Whopper Burger", price: 119, image: "/img/burger.png" },
          { name: "Cheese Burger", price: 99, image: "/img/burger.png" },
          { name: "Chicken Fries", price: 129, image: "/img/street food.png" },
        ]
      },
    ],
    premium: [
      {
        id: 3,
        name: "Pizza Hut",
        image: "/img/pizza.png",
        items: [
          { name: "Margherita Pizza", price: 180, image: "/img/pizza.png" },
          { name: "Veggie Pizza", price: 150, image: "/img/pizza.png" },
        ]
      },
    ],
    feast: [
      {
        id: 4,
        name: "Haldiram's",
        image: "/img/thali.png",
        items: [
          { name: "Chole Bhature Combo", price: 220, image: "/img/thali.png" },
          { name: "Raj Kachori", price: 200, image: "/img/street food.png" },
        ]
      },
    ],
  }

  const foodCategories = [
    { name: "Biryani", img: "/img/biryani.png" },
    { name: "Paratha", img: "/img/Paratha.png" },
    { name: "Rolls", img: "/img/Rolls.png" },
    { name: "Dosa", img: "/img/Dosa.png" },
    { name: "Noodles", img: "/img/noodles.png" },
    { name: "Pasta", img: "/img/pasta.png" },
    { name: "Pastry", img: "/img/Cake.png" },
    { name: "Gulab Jamun", img: "/img/gulabjamun.png" },
    { name: "Pav Bhaji", img: "/img/Pav Bhaji.png" },
    { name: "Shawarma", img: "/img/shawarma.png" },
    { name: "Salad", img: "/img/salad.png" },
    { name: "Kebab", img: "/img/kebab.png" },
    { name: "Rasmalai", img: "/img/rasmalai.png" },
    { name: "Pizza", img: "/img/pizza.png" },
    { name: "Burger", img: "/img/burger.png" },
    { name: "Momos", img: "/img/momos.png" },
    { name: "Chole Bhature", img: "/img/Chole Bhature.png" },
    { name: "Idli", img: "/img/Idli.png" },
    { name: "Jalebi", img: "/img/Jalebi.png" },
    { name: "Tea", img: "/img/tea.png" },
    { name: "Thali", img: "/img/thali.png" },
  ]

  const popularItems = [
    {
      name: "Fried Rice With Manchurian",
      restaurant: "Chandraksh Bhoj",
      price: 299,
      image: "/img/friedrice.png",
      rating: 4.2,
      deliveryTime: "30-35 min"
    },
    {
      name: "Spinach And Feta Cheese Pizza",
      restaurant: "Cha Bar",
      price: 399,
      image: "/img/Fetacheese.png",
      rating: 4.5,
      deliveryTime: "25-30 min"
    },
    {
      name: "Veg Biryani With Burani Raita",
      restaurant: "Chandraksh Bhoj",
      price: 249,
      image: "/img/vegbiryani.png",
      rating: 4.3,
      deliveryTime: "35-40 min"
    },
    {
      name: "Gulab Jamun [2 Pieces]",
      restaurant: "Local",
      price: 99,
      image: "/img/gulabjamun2.png",
      rating: 4.0,
      deliveryTime: "20-25 min"
    },
    {
      name: "Veg Sweet Corn Soup",
      restaurant: "Castle's Barbeque",
      price: 149,
      image: "/img/cornsoup.png",
      rating: 4.1,
      deliveryTime: "25-30 min"
    }
  ]

  // Auto-scroll ref for lowest prices section
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll effect - continues even with manual scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scroll = () => {
      const containerWidth = scrollContainer.offsetWidth
      const scrollWidth = scrollContainer.scrollWidth
      const maxScroll = scrollWidth - containerWidth

      if (scrollContainer.scrollLeft < maxScroll) {
        scrollContainer.scrollLeft += 1
      } else {
        scrollContainer.scrollLeft = 0
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top Header Bar with Location, Sign In and Cart */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Matching Footer Style */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <img 
                src="/img/logo.png" 
                alt="GatiMitra Logo" 
                className="h-8 w-auto object-contain"
              />
              <div className="flex items-center">
                <span className="text-2xl font-black text-[#16c2a5]">Gati</span>
                <span className="text-2xl font-black text-[#ff6b35]">Mitra</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search for restaurants, dishes..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#16c2a5] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Right Section - Location, Sign In, Cart */}
            <div className="flex items-center gap-3">
              {/* Location */}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <i className="fas fa-map-marker-alt text-[#ff6b35]"></i>
                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                  {isDetecting ? '📍 Detecting...' : currentLocation}
                </span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>

              {/* Sign In / User */}
              {isAuthenticated && user ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white font-semibold text-sm hover:shadow-lg transition-all">
                  <i className="fas fa-user"></i>
                  <span className="hidden sm:inline">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white font-semibold text-sm hover:shadow-lg transition-all"
                >
                  <i className="fas fa-user"></i>
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#16c2a5] hover:text-white text-gray-700 transition-all"
              >
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff6b35] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search for restaurants, dishes..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#16c2a5] transition-all text-sm"
              />
            </div>
          </div>

          {/* Mobile Location */}
          <div className="sm:hidden mt-2 flex items-center gap-2 text-sm text-gray-600">
            <i className="fas fa-map-marker-alt text-[#ff6b35]"></i>
            <span className="truncate">{isDetecting ? 'Detecting...' : currentLocation}</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Search */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            What would you like to order?
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose from our wide variety of delicious cuisines
          </p>
        </div>

        {/* Order our best food options - Grid Layout like reference */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Picks on GatiMitra</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCategoryPage(prev => Math.max(0, prev - 1))}
                disabled={categoryPage === 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  categoryPage === 0 
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <i className="fas fa-chevron-left text-sm"></i>
              </button>
              <button 
                onClick={() => setCategoryPage(prev => Math.min(Math.ceil(foodCategories.length / 14) - 1, prev + 1))}
                disabled={categoryPage >= Math.ceil(foodCategories.length / 14) - 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  categoryPage >= Math.ceil(foodCategories.length / 14) - 1
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>
          
          {/* Categories Grid - 7 columns on desktop, 2 rows = 14 items per page */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6">
            {foodCategories.slice(categoryPage * 14, (categoryPage + 1) * 14).map((category, index) => (
              <Link
                key={index}
                href={`/restaurants?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center text-center cursor-pointer no-underline"
              >
                {/* Fixed Size Image Container - Uniform for all items */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Category Name */}
                <div className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-[#FF6B6B] transition-colors">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Page Indicator Dots */}
          {Math.ceil(foodCategories.length / 14) > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(foodCategories.length / 14) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCategoryPage(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === categoryPage ? 'bg-[#FF6B6B] w-6' : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lowest Prices Ever Section */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">💰 Lowest Prices Ever!</h2>
            <button className="text-sm sm:text-base text-[#FF6B6B] font-semibold hover:text-[#FF5252] transition-colors">
              View All →
            </button>
          </div>

          {/* Price Cards - Horizontal Scroll with auto-scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {priceCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => setSelectedPriceCard(card.id)}
                className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Card Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        ₹{card.price}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                        {card.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {card.desc}
                      </div>
                    </div>
                  </div>
                  
                  {/* Restaurant Names */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <i className="fas fa-utensils text-[#FF6B6B]"></i>
                      <span>Chamadehivary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <i className="fas fa-utensils text-[#FF6B6B]"></i>
                      <span>Chamadehivary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <i className="fas fa-utensils text-[#FF6B6B]"></i>
                      <span>Chamadehivary</span>
                    </div>
                  </div>

                  <button className="w-full mt-5 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items Section */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🔥 Popular Items</h2>
            <button className="text-sm sm:text-base text-[#FF6B6B] font-semibold hover:text-[#FF5252] transition-colors">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Fixed Size Item Image - Uniform across all cards */}
                <div className="relative w-full h-44 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <i className="fas fa-star text-yellow-500 text-xs"></i>
                    <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <i className="fas fa-store text-[#FF6B6B]"></i>
                    <span className="line-clamp-1">{item.restaurant}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <i className="fas fa-clock text-[#FF6B6B]"></i>
                    <span>{item.deliveryTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
                      ₹{item.price}
                    </div>
                    <button 
                      onClick={() => onAddToCart?.({
                        id: `popular-${index}`,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                        restaurantName: item.restaurant
                      })}
                      className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                      <i className="fas fa-plus"></i>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Card Modal */}
        {selectedPriceCard && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#e9ecef] p-6 sm:p-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                      src={priceCards.find(c => c.id === selectedPriceCard)?.image}
                      alt="Category"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                    {priceCards.find(c => c.id === selectedPriceCard)?.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPriceCard(null)}
                  className="text-2xl text-[#6C757D] hover:text-[#1A1A2E] transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {restaurantItems[selectedPriceCard || '']?.length > 0 ? (
                  <div className="space-y-8">
                    {restaurantItems[selectedPriceCard || ''].map((restaurant) => (
                      <div key={restaurant.id} className="border-b border-[#e9ecef] last:border-b-0 pb-8 last:pb-0">
                        {/* Restaurant Name */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">{restaurant.name}</h3>
                            <p className="text-sm text-[#6C757D]">{restaurant.items.length} items available</p>
                          </div>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {restaurant.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 group border border-[#e9ecef]"
                            >
                              {/* Item Image */}
                              <div className="relative h-36 sm:h-40 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                              </div>

                              {/* Item Info */}
                              <div className="p-4">
                                <h4 className="font-bold text-[#1A1A2E] text-base sm:text-lg mb-3 line-clamp-2 min-h-[3rem]">
                                  {item.name}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-[#16c2a5] to-[#ff6b35] bg-clip-text text-transparent">
                                    ₹{item.price}
                                  </span>
                                  <button 
                                    onClick={() => onAddToCart?.({
                                      id: `${restaurant.id}-${idx}`,
                                      name: item.name,
                                      price: item.price,
                                      image: item.image,
                                      quantity: 0,
                                      restaurantName: restaurant.name
                                    })}
                                    className="bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                                    <i className="fas fa-plus text-xs"></i>
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-inbox text-3xl text-[#aaa]"></i>
                    </div>
                    <p className="text-lg text-[#6C757D]">No items available in this price range yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}