'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { useCartAnimation, triggerCartAnimation } from '@/components/cart/CartAnimation'
import CustomizeModal from '@/components/cart/CustomizeModal'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  sizes?: { id: string; name: string; price: number }[]
  addons?: { id: string; name: string; price: number }[]
  image?: string
  isVeg: boolean
  category: string
  isPopular?: boolean
  spiceLevel?: number
  prepTime?: number
}

interface RestaurantData {
  id: string
  name: string
  cuisines: string[]
  address: string
  location: string
  deliveryTime: number
  deliveryFee: number
  rating: number
  reviews: number
  openingHours: string
  closingHours: string
  phone: string
  fssaiLicense: string
  image: string
  images: string[]
  isOpen: boolean
  discountOffer?: {
    percentage: number
    description: string
  }
}

export default function RestaurantPage({ restaurantId }: { restaurantId?: string }) {
  const router = useRouter()
  const { items, addToCart, removeFromCart, getCartQuantity, total, decreaseItem } = useCart()
  const { addFlyingAnimation } = useCartAnimation()
  
  const [activeTab, setActiveTab] = useState<'menu' | 'photos' | 'reviews' | 'info'>('menu')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [localVegOnly, setLocalVegOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [isTabsSticky, setIsTabsSticky] = useState(false)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  
  const sidebarRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const menuSectionRef = useRef<HTMLDivElement>(null)
  const photosSectionRef = useRef<HTMLDivElement>(null)
  const reviewsSectionRef = useRef<HTMLDivElement>(null)
  const infoSectionRef = useRef<HTMLDivElement>(null)
  const cartButtonRef = useRef<HTMLButtonElement>(null)

  // Restaurant data based on provided details
  const restaurant: RestaurantData = {
    id: restaurantId || '1',
    name: 'Hot Chappathis Veg And Non Veg',
    cuisines: ['North Indian', 'Street Food', 'Chinese', 'Biryani', 'Beverages'],
    address: '266/16C1B, Kannagapattu, OMR Road, Thiruporur, Chennai',
    location: 'Thiruporur, Chennai',
    deliveryTime: 40,
    deliveryFee: 35,
    rating: 4.0,
    reviews: 97,
    openingHours: '11:30 AM',
    closingHours: '11:00 PM',
    phone: '+919344198127',
    fssaiLicense: '10421000001362',
    image: '/img/hc.png',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w-800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1630383249892-30c70a5fe451?w=800&h=600&fit=crop',
    ],
    isOpen: false,
    discountOffer: {
      percentage: 25,
      description: '25% off on first order above ₹299'
    }
  }

  // Enhanced menu items with more details
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Paneer Butter Masala',
      description: 'Fresh cottage cheese cubes in rich, creamy tomato gravy with butter and aromatic spices',
      price: 280,
      sizes: [
        { id: 's', name: 'Small', price: 0 },
        { id: 'm', name: 'Regular', price: 40 },
        { id: 'l', name: 'Large', price: 80 },
      ],
      addons: [
        { id: 'a1', name: 'Extra Paneer', price: 60 },
        { id: 'a2', name: 'Extra Gravy', price: 40 },
      ],
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'North Indian',
      isPopular: true,
      spiceLevel: 2,
      prepTime: 20
    },
    {
      id: '2',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice layered with tender chicken pieces, saffron, and royal spices',
      price: 320,
      sizes: [
        { id: 'r', name: 'Regular', price: 0 },
        { id: 'h', name: 'Half', price: -80 },
        { id: 'f', name: 'Family', price: 200 },
      ],
      addons: [
        { id: 'a3', name: 'Boiled Egg', price: 20 },
        { id: 'a4', name: 'Extra Masala', price: 30 },
      ],
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=400&h=300&fit=crop',
      isVeg: false,
      category: 'Biryani',
      isPopular: true,
      spiceLevel: 3,
      prepTime: 25
    },
    {
      id: '3',
      name: 'Chappathi with Kurma',
      description: 'Soft, fresh chappathis served with flavorful mixed vegetable kurma',
      price: 180,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'North Indian',
      isPopular: true,
      spiceLevel: 1,
      prepTime: 15
    },
    {
      id: '4',
      name: 'Chicken 65',
      description: 'Spicy deep-fried chicken appetizer with South Indian flavors and curry leaves',
      price: 250,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
      isVeg: false,
      category: 'Street Food',
      spiceLevel: 4,
      prepTime: 18
    },
    {
      id: '5',
      name: 'Veg Fried Rice',
      description: 'Chinese style fried rice with fresh vegetables, soy sauce, and aromatic garlic',
      price: 220,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'Chinese',
      spiceLevel: 2,
      prepTime: 15
    },
    {
      id: '6',
      name: 'Mutton Rogan Josh',
      description: 'Tender mutton pieces in rich Kashmiri style gravy with authentic spices',
      price: 380,
      image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&h=300&fit=crop',
      isVeg: false,
      category: 'North Indian',
      isPopular: true,
      spiceLevel: 3,
      prepTime: 30
    },
    {
      id: '7',
      name: 'Masala Dosa',
      description: 'Crispy rice crepe filled with spiced potato masala, served with sambar and chutney',
      price: 160,
      image: 'https://images.unsplash.com/photo-1630383249892-30c70a5fe451?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'Street Food',
      spiceLevel: 2,
      prepTime: 12
    },
    {
      id: '8',
      name: 'Fresh Lime Soda',
      description: 'Refreshing lime drink with soda, mint, and a hint of black salt',
      price: 80,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'Beverages',
      spiceLevel: 0,
      prepTime: 5
    },
    {
      id: '9',
      name: 'Butter Naan',
      description: 'Soft, buttery leavened bread baked in tandoor',
      price: 90,
      image: 'https://images.unsplash.com/photo-1633945274415-a3c539d5c12a?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'Breads',
      spiceLevel: 0,
      prepTime: 10
    },
    {
      id: '10',
      name: 'Veg Manchurian',
      description: 'Crispy vegetable balls in sweet and spicy Chinese sauce',
      price: 240,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
      isVeg: true,
      category: 'Chinese',
      isPopular: true,
      spiceLevel: 3,
      prepTime: 20
    }
  ]

  const categories = ['All', 'North Indian', 'Biryani', 'Street Food', 'Chinese', 'Beverages', 'Breads']

  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory
    const vegMatch = !localVegOnly || item.isVeg
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && vegMatch && searchMatch
  })

  const popularItems = menuItems.filter(item => item.isPopular)

  // Scroll listener for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current && tabsRef.current && headerRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect()
        const headerRect = headerRef.current.getBoundingClientRect()
        
        // When sidebar becomes sticky (top position equals its sticky position)
        const isSidebarSticky = sidebarRect.top <= 24 // 24px = top-6 in Tailwind
        setIsTabsSticky(isSidebarSticky)
        
        // When header becomes sticky (reaches top)
        const isHeaderStickyNow = headerRect.top <= 0
        setIsHeaderSticky(isHeaderStickyNow)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // State to handle customization modal
  const [customOpen, setCustomOpen] = useState(false)
  const [customItem, setCustomItem] = useState<MenuItem | null>(null)
  const lastClickedElement = useRef<HTMLElement | null>(null)

  const openCustomizeFor = (menuItem: MenuItem, sourceEl?: HTMLElement | null) => {
    setCustomItem(menuItem)
    setCustomOpen(true)
    lastClickedElement.current = sourceEl ?? null
  }

  const handleAddToCart = (itemId: string, itemName: string, itemElement?: HTMLElement | null) => {
    const menuItem = menuItems.find(m => m.id === itemId)
    if (!menuItem) return

    // If this item has sizes or addons, open modal instead of adding directly
    if ((menuItem.sizes && menuItem.sizes.length > 0) || (menuItem.addons && menuItem.addons.length > 0)) {
      openCustomizeFor(menuItem, itemElement ?? null)
      return
    }

    // No customization -> add directly
    addToCart({
      id: itemId,
      name: itemName,
      basePrice: menuItem.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    })

    // Trigger flying animation if element is provided and cart button exists
    if (itemElement && cartButtonRef.current) {
      triggerCartAnimation(
        itemElement,
        cartButtonRef.current,
        itemName,
        menuItem.image,
        addFlyingAnimation
      )
    }

    // Show notification
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Called when modal selection is confirmed
  const handleConfirmCustomization = ({ quantity, size, addons }: { quantity: number; size?: { id: string; name: string; price: number }; addons?: { id: string; name: string; price: number }[] }) => {
    if (!customItem) return

    addToCart({
      id: customItem.id,
      name: customItem.name,
      basePrice: customItem.price,
      quantity,
      size,
      addons,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    })

    // Trigger animation from last clicked element if present
    if (lastClickedElement.current && cartButtonRef.current) {
      triggerCartAnimation(
        lastClickedElement.current,
        cartButtonRef.current,
        customItem.name,
        customItem.image,
        addFlyingAnimation
      )
    }

    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleRemoveFromCart = (productId: string) => {
    // Decrease one unit for given product id (handles composite entries internally)
    decreaseItem(productId)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <i className="fas fa-check-circle text-xl"></i>
            <div>
              <p className="font-bold">Added to cart!</p>
              <p className="text-sm opacity-90">Item successfully added to your order</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-5">
        {/* Back to Restaurants Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-lg rounded-xl font-bold text-sm text-[#FF6B35] hover:bg-white hover:shadow-xl transition-all duration-300 shadow-md border border-gray-200 hover:-translate-y-1 hover:scale-105 group mb-3"
        >
          <i className="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Restaurant Header Card - Enhanced */}
        <div ref={headerRef} className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-lg overflow-hidden mb-8 border-0 transform hover:scale-[1.005] transition-transform duration-500">
          <div className="relative h-56 md:h-72">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              priority
              className="object-cover opacity-30"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Restaurant Status Badge */}
            <div className={`absolute top-4 right-4 z-20 ${restaurant.isOpen ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm`}>
              <i className={`fas ${restaurant.isOpen ? 'fa-clock' : 'fa-lock'} text-lg`}></i>
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </div>

            {/* Discount Badge */}
            {restaurant.discountOffer && (
              <div className="absolute top-16 right-4 z-20 animate-bounce-slow">
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20">
                  <i className="fas fa-bolt text-lg"></i>
                  <div>
                    <p className="text-lg font-black">{restaurant.discountOffer.percentage}% OFF</p>
                    <p className="text-xs opacity-90">{restaurant.discountOffer.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Restaurant Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
              <div className="max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-black mb-3 drop-shadow-2xl tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {restaurant.name}
                </h1>
                
                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border border-white/30">
                    <i className="fas fa-star text-amber-300 animate-pulse"></i>
                    <span className="text-sm">{restaurant.rating}</span>
                    <span className="text-white/90 text-xs">({restaurant.reviews} ratings)</span>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border border-white/30">
                    <i className="fas fa-utensils"></i>
                    {restaurant.cuisines.slice(0, 3).join(', ')}
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border border-white/30">
                    <i className="fas fa-map-marker-alt"></i>
                    {restaurant.location}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                    <i className="fas fa-heart mr-1"></i>
                    Save
                  </button>
                  <button className="px-4 py-2 text-sm bg-white/20 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                    <i className="fas fa-share mr-2"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar - Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: 'fa-clock', color: 'from-blue-500 to-cyan-500', label: 'Delivery Time', value: `${restaurant.deliveryTime} min` },
            { icon: 'fa-rupee-sign', color: 'from-green-500 to-emerald-600', label: 'Delivery Fee', value: `₹${restaurant.deliveryFee}` },
            { icon: 'fa-motorcycle', color: 'from-purple-500 to-pink-500', label: 'Min. Order', value: '₹199' },
            { icon: 'fa-award', color: 'from-amber-500 to-orange-500', label: 'Rating', value: `${restaurant.rating} ★` },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fas ${item.icon} text-white text-lg`}></i>
              </div>
              <p className="text-xs text-gray-600 font-semibold text-center mb-1">{item.label}</p>
              <p className="text-lg font-black text-gray-900 text-center">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Enhanced */}
          <div ref={sidebarRef} className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6 border border-gray-200 flex flex-col h-[calc(100vh-120px)]">
              {/* Search Box */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pl-9 text-sm bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Veg/Non-Veg Toggle - Enhanced */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <i className="fas fa-leaf text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Veg Only</p>
                        <p className="text-xs text-gray-600">Vegetarian items</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setLocalVegOnly(!localVegOnly)}
                      className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 ${localVegOnly ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-md ${localVegOnly ? 'translate-x-8' : 'translate-x-1'}`} />
                    </div>
                  </label>
                </div>
              </div>

              {/* Categories - Enhanced - Scrollable */}
              <div className="mb-6 flex-1 overflow-y-auto scrollbar-hide">
                <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2 sticky top-0 bg-white">
                  <i className="fas fa-tags text-[#FF6B35]"></i>
                  Categories
                </h4>
                <div className="space-y-1 pr-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-between group ${selectedCategory === cat ? 'bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <span>{cat}</span>
                      <i className={`fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory === cat ? 'text-white' : 'text-gray-400'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Button - Bottom of Sidebar */}
              {items.length > 0 && (
                <button
                  ref={cartButtonRef}
                  onClick={() => router.push('/cart')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-between group mt-4 border-t pt-4"
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-shopping-cart"></i>
                    View Cart
                  </span>
                  <span className="bg-white text-[#FF6B35] px-2 py-1 rounded-full text-xs font-black">
                    {items.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content - Enhanced */}
          <div className="lg:w-3/4">
            {/* Tab Navigation - Enhanced */}
            <div 
              ref={tabsRef}
              className={`bg-white shadow-lg mb-6 border border-gray-200 overflow-hidden transition-all duration-300 ${
                isTabsSticky 
                  ? 'hidden lg:block fixed top-6 right-6 left-auto w-[calc(75%-32px)] rounded-xl z-40' 
                  : 'rounded-2xl'
              }`}
            >
              <div className="flex overflow-x-auto no-scrollbar">
                {(['menu', 'photos', 'reviews', 'info'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      // Smooth scroll to section
                      if (tab === 'menu') scrollToSection(menuSectionRef)
                      else if (tab === 'photos') scrollToSection(photosSectionRef)
                      else if (tab === 'reviews') scrollToSection(reviewsSectionRef)
                      else if (tab === 'info') scrollToSection(infoSectionRef)
                    }}
                    className={`flex-1 px-5 py-3 font-bold text-sm transition-all duration-300 relative whitespace-nowrap min-w-[100px] group ${activeTab === tab ? 'text-[#FF6B35]' : 'text-gray-600 hover:text-[#FF6B35]'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {tab === 'menu' && <i className="fas fa-utensils text-lg"></i>}
                      {tab === 'photos' && <i className="fas fa-images text-lg"></i>}
                      {tab === 'reviews' && <i className="fas fa-star text-lg"></i>}
                      {tab === 'info' && <i className="fas fa-info-circle text-lg"></i>}
                      <span className="capitalize">{tab}</span>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] to-orange-500 transition-all duration-300 transform ${activeTab === tab ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {/* Menu Tab - Enhanced */}
              <div ref={menuSectionRef}>
                {activeTab === 'menu' && (
                  <div>
                  {/* Popular Items Section - Enhanced */}
                  {popularItems.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                              <i className="fas fa-fire text-white text-lg"></i>
                            </div>
                            Popular Dishes
                          </h2>
                          <p className="text-xs text-gray-600">Customer favorites</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularItems.map((item) => (
                          <div key={item.id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 transform hover:-translate-y-1">
                            <div className="absolute top-4 left-4 z-10">
                              {item.isPopular && (
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                  <i className="fas fa-crown"></i>
                                  Popular
                                </span>
                              )}
                            </div>
                            {item.image && (
                              <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                  {item.isVeg ? (
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                      <i className="fas fa-leaf text-white text-lg"></i>
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                      <i className="fas fa-drumstick-bite text-white text-lg"></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                <span className="text-xl font-black text-[#FF6B35]">₹{item.price}</span>
                              </div>
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{item.description}</p>
                              
                              <div className="flex items-center gap-4 mb-4">
                                {item.spiceLevel !== undefined && (
                                  <div className="flex items-center gap-1">
                                    {[...Array(3)].map((_, i) => (
                                      <i key={i} className={`fas fa-pepper-hot ${i < item.spiceLevel! ? 'text-red-500' : 'text-gray-300'}`}></i>
                                    ))}
                                    <span className="text-xs text-gray-600 ml-1">{item.spiceLevel}/3 spicy</span>
                                  </div>
                                )}
                                {item.prepTime && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <i className="fas fa-clock text-sm"></i>
                                    <span className="text-xs">{item.prepTime} min</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  <i className="fas fa-tag mr-1"></i>
                                  {item.category}
                                </div>
                                {getCartQuantity(item.id) > 0 ? (
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => handleRemoveFromCart(item.id)}
                                      className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:scale-110 transition-all duration-200 shadow-md"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                    <span className="font-bold text-lg w-8 text-center">{getCartQuantity(item.id)}</span>
                                    <button 
                                      onClick={(e) => handleAddToCart(item.id, item.name, e.currentTarget as HTMLElement)}
                                      className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:scale-110 transition-all duration-200 shadow-md"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => handleAddToCart(item.id, item.name, e.currentTarget as HTMLElement)}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md group"
                                  >
                                    <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
                                    Add to Cart
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Menu Items - Enhanced */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                          <i className="fas fa-list text-white text-lg"></i>
                        </div>
                        Full Menu
                        <span className="text-sm font-normal text-gray-600 ml-1">
                          ({filteredMenuItems.length} items)
                        </span>
                      </h2>
                      <div className="text-gray-600">
                        <i className="fas fa-filter mr-2"></i>
                        Filtered by: {selectedCategory}
                      </div>
                    </div>
                    
                    {filteredMenuItems.length > 0 ? (
                      <div className="space-y-4">
                        {filteredMenuItems.map((item) => (
                          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group">
                            <div className="flex">
                              {item.image && (
                                <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              )}
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1 mb-1">
                                      {item.name}
                                      {item.isVeg ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                          <i className="fas fa-leaf mr-1"></i>Veg
                                        </span>
                                      ) : (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                          <i className="fas fa-drumstick-bite mr-1"></i>Non-Veg
                                        </span>
                                      )}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <i className="fas fa-tag"></i>
                                        {item.category}
                                      </span>
                                      {item.spiceLevel !== undefined && (
                                        <span className="flex items-center gap-1">
                                          <i className="fas fa-pepper-hot"></i>
                                          {item.spiceLevel}/3
                                        </span>
                                      )}
                                      {item.prepTime && (
                                        <span className="flex items-center gap-1">
                                          <i className="fas fa-clock"></i>
                                          {item.prepTime} min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-xl font-black text-[#FF6B35]">₹{item.price}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-500">
                                    {item.isPopular && (
                                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                                        <i className="fas fa-star text-xs"></i>
                                        Popular Choice
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    {getCartQuantity(item.id) > 0 ? (
                                      <div className="flex items-center gap-3">
                                        <button 
                                          onClick={() => handleRemoveFromCart(item.id)}
                                          className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:scale-110 transition-all duration-200 shadow-sm"
                                        >
                                          <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="font-bold text-lg w-8 text-center">{getCartQuantity(item.id)}</span>
                                        <button 
                                          onClick={(e) => handleAddToCart(item.id, item.name, e.currentTarget as HTMLElement)}
                                          className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:scale-110 transition-all duration-200 shadow-sm"
                                        >
                                          <i className="fas fa-plus"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={(e) => handleAddToCart(item.id, item.name, e.currentTarget as HTMLElement)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                                      >
                                        <i className="fas fa-plus mr-2"></i>
                                        Add to Cart
                                      </button>
                                    )}
                                    <button className="text-gray-500 hover:text-[#FF6B35] transition-colors">
                                      <i className="fas fa-heart text-lg"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                          <i className="fas fa-utensils text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-500 mb-3">No items found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your filters or search term</p>
                        <button 
                          onClick={() => {
                            setSelectedCategory('All')
                            setSearchQuery('')
                            setLocalVegOnly(false)
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>

              {/* Photos Tab - Enhanced */}
              <div ref={photosSectionRef}>
                {activeTab === 'photos' && (
                  <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Restaurant Gallery</h2>
                    <p className="text-gray-600">Take a look inside our restaurant and dishes</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurant.images.map((img, idx) => (
                      <div key={idx} className="group relative h-56 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer">
                        <Image
                          src={img}
                          alt={`${restaurant.name} photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-camera"></i>
                            <span className="font-medium">Restaurant View {idx + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>

              {/* Reviews Tab - Enhanced */}
              <div ref={reviewsSectionRef}>
                {activeTab === 'reviews' && (
                  <div>
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-6 border border-amber-200 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mb-4 shadow-2xl">
                          <i className="fas fa-star text-4xl text-white"></i>
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 mb-2">{restaurant.rating} ★</h3>
                        <p className="text-gray-700 font-medium">Based on {restaurant.reviews} verified reviews</p>
                        <div className="flex items-center gap-1 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star text-xl ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-1 max-w-md">
                        {[
                          { label: 'Food Quality', value: 4.5 },
                          { label: 'Service', value: 4.0 },
                          { label: 'Value for Money', value: 4.2 },
                          { label: 'Delivery Time', value: 4.3 },
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">{stat.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                  style={{ width: `${(stat.value / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-gray-900 min-w-[40px]">{stat.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Reviews</h3>
                  <div className="space-y-6">
                    {/* Sample Review 1 - Enhanced */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            RA
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Rahul Agarwal</h4>
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star text-sm ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}></i>
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">Ordered 3 days ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                            <i className="fas fa-check-circle text-green-500 mr-1"></i>
                            Verified Order
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">"The biryani was absolutely amazing! Perfectly cooked rice, tender chicken pieces, and just the right amount of spices. Delivery was quick and the food arrived piping hot. Definitely ordering again!"</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <i className="fas fa-thumbs-up mr-1"></i>12 Helpful
                        </span>
                        <button className="text-gray-500 hover:text-[#FF6B35] transition-colors text-sm">
                          <i className="fas fa-reply mr-1"></i>Reply
                        </button>
                      </div>
                    </div>

                    {/* Sample Review 2 - Enhanced */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            SP
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Sneha Patel</h4>
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star text-sm ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}></i>
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">Ordered 1 week ago</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">"Loved the chappathis and kurma combo! The chappathis were soft and fresh, and the kurma had the perfect balance of flavors. The packaging was excellent and the quantity was sufficient for two people. Great value for money!"</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop"
                              alt="Food photo"
                              width={100}
                              height={100}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            <i className="fas fa-thumbs-up mr-1"></i>8 Helpful
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Info Tab - Enhanced */}
              <div ref={infoSectionRef}>
                {activeTab === 'info' && (
                  <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-8">Restaurant Information</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Operating Hours - Enhanced */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border border-blue-100">
                      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                          <i className="fas fa-clock text-white text-xl"></i>
                        </div>
                        Operating Hours
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Opens At', value: restaurant.openingHours, icon: 'fa-door-open' },
                          { label: 'Closes At', value: restaurant.closingHours, icon: 'fa-door-closed' },
                          { 
                            label: 'Current Status', 
                            value: restaurant.isOpen ? 'Open Now' : 'Closed', 
                            icon: restaurant.isOpen ? 'fa-check-circle' : 'fa-times-circle',
                            color: restaurant.isOpen ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                          },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${idx === 2 ? item.color : 'bg-blue-50'} flex items-center justify-center`}>
                                <i className={`fas ${item.icon} ${idx === 2 ? (restaurant.isOpen ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`}></i>
                              </div>
                              <span className="font-semibold text-gray-700">{item.label}</span>
                            </div>
                            <span className={`font-bold ${idx === 2 ? (restaurant.isOpen ? 'text-green-600' : 'text-red-600') : 'text-blue-600'} text-lg`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info - Enhanced */}
                    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100">
                      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                          <i className="fas fa-phone-alt text-white text-xl"></i>
                        </div>
                        Contact Information
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-phone text-green-600"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-lg text-gray-900">{restaurant.phone}</p>
                            <p className="text-sm text-gray-600">Primary contact number</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <a 
                            href={`tel:${restaurant.phone}`}
                            className="block py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg group"
                          >
                            <i className="fas fa-phone-alt mr-2 group-hover:animate-pulse"></i>
                            Call Now
                          </a>
                          <button className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg group">
                            <i className="fab fa-whatsapp mr-2 group-hover:animate-bounce"></i>
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Address - Enhanced */}
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-xl border border-purple-100 lg:col-span-2">
                      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <i className="fas fa-map-marker-alt text-white text-xl"></i>
                        </div>
                        Address & Location
                      </h3>
                      <div className="bg-white rounded-2xl p-6 shadow-inner border border-gray-200 mb-6">
                        <div className="flex items-start gap-4">
                          <i className="fas fa-map-pin text-purple-500 text-xl mt-1"></i>
                          <div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">{restaurant.address}</p>
                            <div className="flex flex-wrap gap-3">
                              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                <i className="fas fa-car mr-1"></i>Parking Available
                              </span>
                              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                <i className="fas fa-wheelchair mr-1"></i>Wheelchair Accessible
                              </span>
                              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                <i className="fas fa-wifi mr-1"></i>Free WiFi
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg group">
                          <i className="fas fa-map mr-2 group-hover:animate-pulse"></i>
                          View on Google Maps
                        </button>
                        <button className="py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg group">
                          <i className="fas fa-directions mr-2 group-hover:animate-pulse"></i>
                          Get Directions
                        </button>
                        <button className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg group">
                          <i className="fas fa-share-alt mr-2 group-hover:animate-pulse"></i>
                          Share Location
                        </button>
                      </div>
                    </div>

                    {/* FSSAI Info - Enhanced */}
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 shadow-xl border border-amber-100">
                      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <i className="fas fa-certificate text-white text-xl"></i>
                        </div>
                        Food Safety & License
                      </h3>
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                        <div className="mb-4">
                          <p className="text-sm text-amber-700 font-medium mb-1">FSSAI License Number</p>
                          <p className="font-mono text-xl font-black text-amber-800 tracking-wider">{restaurant.fssaiLicense}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fas fa-check-circle text-green-600"></i>
                          </div>
                          <div>
                            <p className="font-bold text-green-700">Verified License</p>
                            <p className="text-sm text-amber-700">Valid until Dec 2025</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
                        <i className="fas fa-info-circle text-amber-500"></i>
                        This restaurant follows all FSSAI safety guidelines
                      </p>
                    </div>

                    {/* Cuisines - Enhanced */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-xl border border-indigo-100">
                      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                          <i className="fas fa-utensils text-white text-xl"></i>
                        </div>
                        Cuisines Served
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {restaurant.cuisines.map((cuisine, idx) => (
                          <span 
                            key={idx} 
                            className="px-4 py-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-medium border border-indigo-200 hover:border-indigo-300 transition-colors"
                          >
                            <i className="fas fa-check-circle mr-2 text-indigo-500"></i>
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Add custom styles for animations */}
      <CustomizeModal
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        item={customItem ? { id: customItem.id, name: customItem.name, basePrice: customItem.price, sizes: customItem.sizes, addons: customItem.addons, image: customItem.image } : undefined}
        onConfirm={handleConfirmCustomization}
      />
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  )
}