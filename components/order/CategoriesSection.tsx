'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { useDispatch } from 'react-redux'
import { restoreAuth } from '@/lib/slices/authSlice'
import { useCart } from '@/lib/hooks/useCart'
import { CartItem } from './OrderPage'
import AuthModal from '@/components/auth/AuthModal'
import UserProfileModal from '@/components/auth/UserProfileModal'

import RestaurantSwitchModal from '@/components/cart/RestaurantSwitchModal'
import CustomizeModal from '@/components/cart/CustomizeModal'

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
  const dispatch = useDispatch();
  const { isFromDifferentRestaurant, clearCartItems, addToCart } = useCart()
  const [selectedPriceCard, setSelectedPriceCard] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState('Detecting...')
  const [isDetecting, setIsDetecting] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [categoryPage, setCategoryPage] = useState(0)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  // Cache for previous search queries
  const searchCache = useRef<{ [key: string]: any[] }>({})
  // Restaurant list for mapping id to name
  const [restaurantList, setRestaurantList] = useState<any[]>([])
    // Fetch restaurant list on mount
    useEffect(() => {
      fetch('/api/restaurants')
        .then(res => res.json())
        .then(data => setRestaurantList(data || []))
        .catch(() => setRestaurantList([]));
    }, []);
  
  // Notification state
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  
  // Restaurant switch modal state
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  // Pending item with all needed info
  const [pendingItemFull, setPendingItemFull] = useState<{
    id: string
    name: string
    price: number
    image: string
    restaurantId: string
    restaurant: string
  } | null>(null)
  const [switchFromRestaurant, setSwitchFromRestaurant] = useState('')
  const [switchToRestaurant, setSwitchToRestaurant] = useState('')
  
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  // Restore auth state on mount
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);
  const cartItems = useAppSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation()
  }, [])

  // Real-time, instant search handler with cache and no loading state
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    // Check cache for all prefixes to allow instant refinement
    let bestCached = null;
    for (let i = value.length; i > 0; i--) {
      const prefix = value.slice(0, i);
      if (searchCache.current[prefix]) {
        bestCached = searchCache.current[prefix];
        break;
      }
    }
    if (bestCached) {
      // Refine cached results client-side for partial/exact match
      const lower = value.toLowerCase();
      const refined = bestCached
        .filter(item =>
          (item.item_name && item.item_name.toLowerCase().includes(lower)) ||
          (item.category && item.category.toLowerCase().includes(lower)) ||
          (item.category_item && item.category_item.toLowerCase().includes(lower))
        )
        .sort((a, b) => {
          // Exact match first, then partial
          const aExact = a.item_name && a.item_name.toLowerCase() === lower;
          const bExact = b.item_name && b.item_name.toLowerCase() === lower;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          // Otherwise, shorter match first
          return (a.item_name?.length || 0) - (b.item_name?.length || 0);
        });
      setSearchResults(refined);
    } else {
      // Fire API call, but do not block UI or show loading
      fetch(`/api/search?q=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => {
          searchCache.current[value] = data || [];
          setSearchResults(data || []);
        })
        .catch(() => {
          setSearchResults([]);
        });
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.relative')) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
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
      id: "pop-1",
      restaurantId: "chandraksh-bhoj",
      name: "Fried Rice With Manchurian",
      restaurant: "Chandraksh Bhoj",
      price: 299,
      image: "/img/friedrice.png",
      rating: 4.2,
      deliveryTime: "30-35 min"
    },
    {
      id: "pop-2",
      restaurantId: "cha-bar",
      name: "Spinach And Feta Cheese Pizza",
      restaurant: "Cha Bar",
      price: 399,
      image: "/img/Fetacheese.png",
      rating: 4.5,
      deliveryTime: "25-30 min"
    },
    {
      id: "pop-3",
      restaurantId: "chandraksh-bhoj",
      name: "Veg Biryani With Burani Raita",
      restaurant: "Chandraksh Bhoj",
      price: 249,
      image: "/img/vegbiryani.png",
      rating: 4.3,
      deliveryTime: "35-40 min"
    },
    {
      id: "pop-4",
      restaurantId: "local-sweets",
      name: "Gulab Jamun [2 Pieces]",
      restaurant: "Local",
      price: 99,
      image: "/img/gulabjamun2.png",
      rating: 4.0,
      deliveryTime: "20-25 min"
    },
    {
      id: "pop-5",
      restaurantId: "castles-barbeque",
      name: "Veg Sweet Corn Soup",
      restaurant: "Castle's Barbeque",
      price: 149,
      image: "/img/cornsoup.png",
      rating: 4.1,
      deliveryTime: "25-30 min"
    }
  ]

  // Show notification
  const showNotification = (message: string) => {
    setNotification({ show: true, message })
    setTimeout(() => {
      setNotification({ show: false, message: '' })
    }, 3000)
  }

  // Handle add to cart with restaurant switch check
  const [customizeModalItem, setCustomizeModalItem] = useState<any | null>(null);
  const handleAddWithCheck = async (item: any) => {
    // Fetch menu item details from API to check for customizations/addons/sizes
    let menuItemDetails = item;
    try {
      const res = await fetch(`/api/menu_items?id=${item.id}`);
      if (res.ok) {
        const data = await res.json();
        // Merge all possible customizability fields
        if ((data && ((data.customizations && data.customizations.length > 0) || (data.addons && data.addons.length > 0) || (data.sizes && data.sizes.length > 0)))) {
          menuItemDetails = { ...item, ...data };
        }
      }
    } catch {}

    // If item is customizable (has customizations, addons, or sizes), show customization modal first
    if ((menuItemDetails.customizations && menuItemDetails.customizations.length > 0) ||
        (menuItemDetails.addons && menuItemDetails.addons.length > 0) ||
        (menuItemDetails.sizes && menuItemDetails.sizes.length > 0) ||
        menuItemDetails.customizable) {
      setCustomizeModalItem(menuItemDetails);
      return;
    }

    // Check if adding from a different restaurant
    if (isFromDifferentRestaurant(item.restaurantId)) {
      // Get current restaurant name from cart
      const currentRestaurantName = cartItems[0]?.restaurantName || 'Current Restaurant';
      setSwitchFromRestaurant(currentRestaurantName);
      setSwitchToRestaurant(item.restaurant);
      setPendingItemFull({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantId: item.restaurantId,
        restaurant: item.restaurant
      });
      setShowSwitchModal(true);
      return;
    }

    // Add to cart normally
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurant,
      image: item.image,
    });
    showNotification(`${item.name} added to cart!`);
  }


  // Handle restaurant switch confirmation
  const handleSwitchConfirm = (keepBoth: boolean) => {
    if (!pendingItemFull) return

    if (!keepBoth) {
      // Clear cart first
      clearCartItems()
    }

    // Add the pending item
    addToCart({
      id: pendingItemFull.id,
      name: pendingItemFull.name,
      price: pendingItemFull.price,
      quantity: 1,
      restaurantId: pendingItemFull.restaurantId,
      restaurantName: pendingItemFull.restaurant,
      image: pendingItemFull.image,
    })

    showNotification(`${pendingItemFull.name} added to cart!`)
    setShowSwitchModal(false)
    setPendingItemFull(null)
  }

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
      {/* Customization Modal for Customizable Items */}
      {customizeModalItem && (
        <CustomizeModal
          open={!!customizeModalItem}
          item={customizeModalItem}
          onClose={() => setCustomizeModalItem(null)}
          onConfirm={(customizedItem: { quantity: number; size?: any; addons?: any[] }) => {
            addToCart({ ...customizeModalItem, ...customizedItem });
            showNotification(`${customizeModalItem.name} added to cart!`);
            setCustomizeModalItem(null);
          }}
        />
      )}
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
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => setShowSearchResults(true)}
                />
                {showSearchResults && searchQuery && (
                  <div className="absolute left-0 right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {searchResults.length > 0 && searchResults.map((item, idx) => {
                      // Find restaurant name from restaurantList
                      const restaurant = restaurantList.find(r => r.restaurant_id === item.restaurant_id || r.id === item.restaurant_id);
                      const restaurantName = restaurant ? (restaurant.restaurant_name || restaurant.name) : 'Unknown Restaurant';
                      const restaurantPageUrl = restaurant ? `/restaurant/${restaurant.restaurant_id || restaurant.id}` : '#';
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-purple-light cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 min-h-[56px]"
                          style={{ minHeight: 56 }}
                          onClick={() => restaurant && window.location.assign(restaurantPageUrl)}
                        >
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.item_name}
                              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex flex-col justify-center flex-1 min-w-0">
                            <div className="font-semibold text-text text-sm truncate">{item.item_name}</div>
                            <div className="text-xs text-blue-600 font-semibold truncate">
                              <span style={{textDecoration:'underline'}}>{restaurantName}</span>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                              {item.category && <span>{item.category}</span>}
                              {item.category_item && <span className="text-gray-400">{item.category_item}</span>}
                              {item.price && <span>₹{item.price}</span>}
                              {typeof item.score !== 'undefined' && <span className="text-green-600">Score: {item.score}</span>}
                            </div>
                          </div>
                          {item.score === 100 && (
                            <span className="px-2 py-1 bg-mint-light text-purple text-xs font-bold rounded-full ml-2">
                              Exact Match
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {searchResults.length === 0 && (
                      <div className="px-4 py-2 text-center text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                    )}
                  </div>
                )}
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
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white font-semibold text-sm hover:shadow-lg transition-all"
                  type="button"
                >
                  <i className="fas fa-user"></i>
                  <span className="hidden sm:inline">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsAuthModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8451] text-white font-semibold text-sm hover:shadow-lg transition-all z-50"
                  type="button"
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
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setShowSearchResults(true)}
              />
              {showSearchResults && searchQuery && (
                <div className="absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 && searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 hover:bg-purple-light cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.item_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-text">{item.item_name}</div>
                          {item.category && (
                            <div className="text-sm text-text-light">{item.category}</div>
                          )}
                          {item.category_item && (
                            <div className="text-xs text-gray-400">{item.category_item}</div>
                          )}
                          {item.price && (
                            <div className="text-xs text-gray-500 mt-1">₹{item.price}</div>
                          )}
                          {typeof item.score !== 'undefined' && (
                            <div className="text-xs text-green-600 mt-1">Score: {item.score}</div>
                          )}
                        </div>
                        {item.score === 100 && (
                          <span className="px-2 py-1 bg-mint-light text-purple text-xs font-bold rounded-full">
                            Exact Match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="px-6 py-4 text-center text-gray-400">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
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
                      onClick={() => handleAddWithCheck(item)}
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
                                    onClick={() => handleAddWithCheck({
                                      id: `modal-${restaurant.id}-${idx}`,
                                      restaurantId: `restaurant-${restaurant.id}`,
                                      name: item.name,
                                      price: item.price,
                                      image: item.image,
                                      restaurant: restaurant.name
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

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Restaurant Switch Modal */}
      <RestaurantSwitchModal
        isOpen={showSwitchModal}
        onClose={() => {
          setShowSwitchModal(false)
          setPendingItemFull(null)
        }}
        onConfirm={handleSwitchConfirm}
        currentRestaurantName={switchFromRestaurant}
        newRestaurantName={switchToRestaurant}
      />

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-check text-white"></i>
            </div>
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
