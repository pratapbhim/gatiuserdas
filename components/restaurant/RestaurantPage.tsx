"use client";

// BannerCarousel component for infinite image loop
import { useState as useReactState, useEffect as useReactEffect } from 'react';
function BannerCarousel({ images, fallback, alt, restaurant, getIsOpen }) {
  const [idx, setIdx] = useReactState(0);
  const [isPaused, setIsPaused] = useReactState(false);
  // Strict sequence: banner, 5 top-rated menu items, banner, ...
  const topImages = (images || [])
    .filter(img => !!img.src)
    .slice(0, 5)
    .map(img => ({ ...img, type: 'item' }));
  const allImages = [
    { src: fallback, alt, type: 'banner' },
    ...topImages,
  ];
  // Preload all images
  allImages.forEach(img => {
    if (typeof window !== 'undefined') {
      const preload = new window.Image();
      preload.src = img.src;
    }
  });
  // Infinite loop logic, 4s per slide, smooth
  useReactEffect(() => {
    if (isPaused || allImages.length < 2) return;
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [allImages.length, isPaused]);

  // For sliding animation: always render current and previous
  const getSlide = (i) => {
    if (i < 0) return allImages.length - 1;
    if (i >= allImages.length) return 0;
    return i;
  };
  const prevIdx = getSlide(idx - 1);
  const currIdx = idx;

  // Helper: decide object-fit and background for each image type
  const getImageProps = (img) => {
    if (img.type === 'banner') {
      return {
        className: 'object-cover',
        style: { objectFit: 'cover', background: 'none' },
      };
    } else {
      return {
        className: 'object-contain',
        style: { objectFit: 'contain', background: 'none', zIndex: 2 },
      };
    }
  };

  return (
    <div
      className="relative h-56 md:h-72 w-full bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Blurred background for item slides */}
      {allImages[currIdx].type === 'item' && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={allImages[currIdx].src}
            alt={allImages[currIdx].alt}
            fill
            priority
            style={{ objectFit: 'cover', filter: 'blur(18px) brightness(0.7)' }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
          {/* Always show overlay on top of all slides (including banner) */}
          {typeof restaurant !== 'undefined' && restaurant && (
            <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-20">
              <div className="w-full px-5 md:px-8 pb-5 md:pb-8 pt-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-2xl">
                <div className="max-w-3xl">
                  <h1 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-2xl tracking-tight text-white">
                    {restaurant.restaurant_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {restaurant.cuisine_type && (
                      <span className="bg-white/30 px-3 py-1 rounded-lg font-bold text-xs border border-white/40 text-white shadow">
                        <i className="fas fa-utensils"></i> {restaurant.cuisine_type}
                      </span>
                    )}
                    {restaurant.address && (
                      <span className="bg-white/30 px-3 py-1 rounded-lg font-bold text-xs border border-white/40 text-white shadow">
                        <i className="fas fa-map-marker-alt"></i> {restaurant.address}
                      </span>
                    )}
                    {restaurant.phone && (
                      <span className="bg-white/30 px-3 py-1 rounded-lg font-bold text-xs border border-white/40 text-white shadow">
                        <i className="fas fa-phone"></i> {restaurant.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Verification Status */}
                    {restaurant.is_verified ? (
                      <span className="bg-green-600 px-3 py-1 rounded-lg font-bold text-xs border border-green-300 text-white flex items-center gap-1 shadow">
                        <i className="fas fa-check-circle"></i> Verified
                      </span>
                    ) : (
                      <span className="bg-red-600 px-3 py-1 rounded-lg font-bold text-xs border border-red-300 text-white flex items-center gap-1 shadow">
                        <i className="fas fa-times-circle"></i> Not Verified
                      </span>
                    )}
                    {/* Open/Closed Status */}
                    {typeof getIsOpen === 'function' && getIsOpen(restaurant) ? (
                      <span className="bg-green-500 px-3 py-1 rounded-lg font-bold text-xs border border-green-300 text-white flex items-center gap-1 shadow">
                        <i className="fas fa-door-open"></i> Open Now
                      </span>
                    ) : (
                      <span className="bg-gray-700 px-3 py-1 rounded-lg font-bold text-xs border border-gray-300 text-white flex items-center gap-1 shadow">
                        <i className="fas fa-door-closed"></i> Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      <div className="absolute inset-0 w-full h-full">
        {/* Previous slide (exiting right) */}
        <div
          key={prevIdx}
          className="w-full h-full flex-shrink-0 flex items-center justify-center slide-exit"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            transition: 'transform 0.8s cubic-bezier(0.4,0.8,0.4,1)',
            transform: 'translateX(100%)',
          }}
        >
          <Image
            src={allImages[prevIdx].src}
            alt={allImages[prevIdx].alt}
            fill
            priority
            {...getImageProps(allImages[prevIdx])}
          />
        </div>
        {/* Current slide (entering from left) */}
        <div
          key={currIdx}
          className="w-full h-full flex-shrink-0 flex items-center justify-center slide-enter"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
            transition: 'transform 0.8s cubic-bezier(0.4,0.8,0.4,1)',
            transform: 'translateX(0%)',
          }}
        >
          <Image
            src={allImages[currIdx].src}
            alt={allImages[currIdx].alt}
            fill
            priority
            {...getImageProps(allImages[currIdx])}
          />
        </div>
      </div>
      <style jsx>{`
        .slide-enter {
          animation: slideInLeft 0.8s cubic-bezier(0.4,0.8,0.4,1);
        }
        .slide-exit {
          animation: slideOutRight 0.8s cubic-bezier(0.4,0.8,0.4,1);
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Skeleton Loader Components
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}></div>;
}

function RestaurantSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Banner Skeleton */}
      <div className="bg-white shadow-lg mb-6 border border-gray-200 overflow-hidden rounded-2xl">
        <Skeleton className="h-72 w-full" />
      </div>
      {/* Quick Info Bar Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col lg:flex-row-reverse gap-6">
        {/* Sidebar Skeleton */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200 flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-lg mb-4" />
            <Skeleton className="h-16 w-full rounded-lg mb-4" />
            <Skeleton className="h-40 w-full rounded-lg mb-4" />
            <Skeleton className="h-12 w-full rounded-lg mb-4" />
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="lg:w-3/4 pl-4 lg:pl-6">
          <Skeleton className="h-12 w-full rounded-xl mb-6" />
          {[...Array(3)].map((_,i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl mb-4" />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { useCartAnimation, triggerCartAnimation } from '@/components/cart/CartAnimation'
import CustomizeModal from '@/components/cart/CustomizeModal'
import RestaurantSwitchModal from '@/components/cart/RestaurantSwitchModal'


// Define MenuItem and Restaurant interfaces as before
interface MenuItem {
  id: string;
  restaurant_id: string;
  item_name: string;
  category: string;
  category_item?: string;
  price: number;
  offer_price?: number | null;
  image_url?: string | null;
  in_stock?: boolean;
  description?: string;
  customizations?: any[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Restaurant {
  id: string
  name: string
  image: string
  isOpen: boolean
  rating: number
  reviews: number
  cuisines: string[]
  location: string
  discountOffer?: {
    percentage: number
    description: string
  }
  deliveryTime: number
  deliveryFee: number
  openingHours: string
  closingHours: string
  phone: string
  restaurant_id: string;
  restaurant_name: string;
  store_img?: string;
  cuisine_type?: string;
  address?: string;
  is_active?: boolean;
  opening_time?: string;
  closing_time?: string;
  avg_rating?: number;
  total_reviews?: number;
  delivery_time_minutes?: number;
  delivery_fee?: number;
  fssai_license?: string;
}

// Main component function
function RestaurantPage({ restaurantId }: { restaurantId: string }) {
  // Create Supabase client (move inside component)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { items, addToCart, decreaseItem, getCartQuantity, isFromDifferentRestaurant, restaurantName: currentCartRestaurantName, clearCartItems } = useCart()
  const { addFlyingAnimation } = useCartAnimation()

  // State for UI
  const [activeTab, setActiveTab] = useState<'menu' | 'photos' | 'reviews' | 'info'>('menu')
  const [showNotification, setShowNotification] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [localVegOnly, setLocalVegOnly] = useState(false)
  const [isTabsSticky, setIsTabsSticky] = useState(false)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)

  // Helper: Calculate open/closed status
  function getIsOpen(restaurant: any) {
    if (!restaurant) return false;
    if (restaurant.is_active === false) return false;
    try {
      const now = new Date();
      const opening = restaurant.opening_time ? parseTime(restaurant.opening_time) : null;
      const closing = restaurant.closing_time ? parseTime(restaurant.closing_time) : null;
      if (!opening || !closing) return false;
      // Handles overnight closing (e.g. 22:00 to 06:00)
      if (closing <= opening) {
        return (now >= opening) || (now <= closing);
      }
      return now >= opening && now <= closing;
    } catch {
      return false;
    }
  }

  function parseTime(timeStr: string) {
    // Expects 'HH:mm' or 'HH:mm:ss' (24h)
    const [h, m, s] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(h, m || 0, s || 0, 0);
    return now;
  }

  // State for restaurant switch confirmation
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  const [pendingAddItem, setPendingAddItem] = useState<any | null>(null)
  const [pendingItemElement, setPendingItemElement] = useState<HTMLElement | null>(null)

  // Refs for scrolling and animations
  const tabsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const menuSectionRef = useRef<HTMLDivElement>(null)
  const photosSectionRef = useRef<HTMLDivElement>(null)
  const reviewsSectionRef = useRef<HTMLDivElement>(null)
  const infoSectionRef = useRef<HTMLDivElement>(null)

  // Fetch data from Supabase
  useEffect(() => {
    setError(null);
    setLoadingRestaurant(true);
    setLoadingMenu(true);
    setLoadingOffers(true);

    // Fetch restaurant details
    supabase
      .from('restaurants')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single()
      .then(({ data, error: restaurantError }) => {
        if (restaurantError || !data) {
          setError('Restaurant not found');
        } else {
          setRestaurant(data);
        }
        setLoadingRestaurant(false);
      });

    // Fetch menu items
    supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .then(({ data, error: menuError }) => {
        if (!menuError) setMenuItems(data || []);
        setLoadingMenu(false);
      });

    // Fetch offers
    const now = new Date().toISOString();
    supabase
      .from('offers')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .gt('valid_till', now)
      .then(({ data, error: offersError }) => {
        if (!offersError) setOffers(data || []);
        setLoadingOffers(false);
      });
  }, [restaurantId]);

  // Show unique category_item values in sidebar
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category_item).filter(Boolean)))]

  // Filtered menu items
  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category_item === selectedCategory;
    // Veg Only toggle: show only items where category is 'VEG' (case-insensitive)
    const vegMatch = !localVegOnly || (item.category && item.category.toUpperCase() === 'VEG');
    const searchMatch = (item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && vegMatch && searchMatch;
  });

  // Popular items (if any flag exists)
  // You can define popularItems logic if you have a flag, else leave empty
  const popularItems: MenuItem[] = [];

  // Scroll listener for sticky tabs: only toggle after user actually scrolls
  useEffect(() => {
    let isTicking = false
    const handleScroll = () => {
      if (!headerRef.current) return
      if (isTicking) return
      isTicking = true
      window.requestAnimationFrame(() => {
        const headerRect = headerRef.current!.getBoundingClientRect()
        // Use bottom <= 0 to ensure the hero/header has fully scrolled out
        const headerPassed = headerRect.bottom <= 0
        setIsTabsSticky(headerPassed)
        setIsHeaderSticky(headerPassed)
        isTicking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // do NOT compute on mount — wait for user scroll to trigger sticky
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
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

  // Helper function to actually add the item to cart
  const performAddToCart = (itemData: any, itemElement?: HTMLElement | null) => {
    addToCart(itemData)

    // Trigger flying animation if element is provided and cart button exists
    const menuItem = menuItems.find(m => m.id === itemData.id)
    if (itemElement && cartButtonRef.current && menuItem) {
      triggerCartAnimation(
        itemElement,
        cartButtonRef.current,
        itemData.name,
        menuItem.image,
        addFlyingAnimation
      )
    }

    // Show notification
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Handle confirmation from restaurant switch modal
  const handleConfirmSwitch = (keepBoth: boolean) => {
    if (!keepBoth) {
      // Clear cart first
      clearCartItems()
    }
    if (pendingAddItem) {
      performAddToCart(pendingAddItem, pendingItemElement)
    }
    setShowSwitchModal(false)
    setPendingAddItem(null)
    setPendingItemElement(null)
  }

  const handleCancelSwitch = () => {
    setShowSwitchModal(false)
    setPendingAddItem(null)
    setPendingItemElement(null)
  }

  const handleAddToCart = (itemId: string, itemName: string, itemElement?: HTMLElement | null) => {
    const menuItem = menuItems.find(m => m.id === itemId)
    if (!menuItem || !restaurant) return

    // If this item has sizes or addons, open modal instead of adding directly
    if ((menuItem.sizes && menuItem.sizes.length > 0) || (menuItem.addons && menuItem.addons.length > 0)) {
      openCustomizeFor(menuItem, itemElement ?? null)
      return
    }

    const itemData = {
      id: itemId,
      name: itemName,
      basePrice: menuItem.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      image: menuItem.image,
    }

    // Check if adding from different restaurant
    if (isFromDifferentRestaurant(restaurant.id)) {
      setPendingAddItem(itemData)
      setPendingItemElement(itemElement ?? null)
      setShowSwitchModal(true)
      return
    }

    // No switch needed -> add directly
    performAddToCart(itemData, itemElement)
  }

  // Called when modal selection is confirmed
  const handleConfirmCustomization = ({ quantity, size, addons }: { quantity: number; size?: { id: string; name: string; price: number }; addons?: { id: string; name: string; price: number }[] }) => {
    if (!customItem || !restaurant) return

    const itemData = {
      id: customItem.id,
      name: customItem.name,
      basePrice: customItem.price,
      quantity,
      size,
      addons,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      image: customItem.image,
    }

    // Check if adding from different restaurant
    if (isFromDifferentRestaurant(restaurant.id)) {
      setPendingAddItem(itemData)
      setPendingItemElement(lastClickedElement.current)
      setShowSwitchModal(true)
      return
    }

    // Add to cart
    addToCart(itemData)

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

  // Show skeleton loader first, then fade to content
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    setShowSkeleton(true);
  }, [restaurantId]);
  useEffect(() => {
    if (!loadingRestaurant && !loadingMenu && !loadingOffers) {
      // Fade out skeleton after data loads
      const timeout = setTimeout(() => setShowSkeleton(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [loadingRestaurant, loadingMenu, loadingOffers]);

  if (showSkeleton) {
    return <RestaurantSkeleton />;
  }
  // Only show error after loading completes and data is missing
  if (!loadingRestaurant && !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <img src="/img/ndf.png" alt="Not Found" style={{ maxWidth: 320, width: '100%', height: 'auto', opacity: 0.85 }} />
      </div>
    );
  }
  if (!loadingRestaurant && error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;
  }

  // Calculate open/closed status
  const isOpen = getIsOpen(restaurant);

  // Offers logic
  const activeOffer = offers && offers.length > 0 ? offers[0] : null;
  // Menu/Offers loading/empty states can be handled in the UI below as needed

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
      <div 
        className={`bg-white shadow-lg mb-6 border border-gray-200 overflow-hidden transition-all duration-300 rounded-2xl mx-auto px-[15px]`}
      >
        {/* Back to Restaurants Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-lg rounded-xl font-bold text-sm text-[#FF6B35] hover:bg-white hover:shadow-xl transition-all duration-300 shadow-md border border-gray-200 hover:-translate-y-1 hover:scale-105 group mb-3"
        >
          <i className="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Restaurant Banner & Info */}
        <div ref={headerRef} className="relative rounded-2xl shadow-lg overflow-hidden mb-8 border-0">
          {/* Banner & Premium Overlay */}
          <div className="relative w-full h-56 md:h-72">
            <BannerCarousel
              images={menuItems
                .filter(item => !!item.image_url)
                .sort((a, b) => ((b.avg_rating ?? b.rating ?? 0) - (a.avg_rating ?? a.rating ?? 0)))
                .slice(0, 5)
                .map(item => ({
                  src: item.image_url,
                  alt: item.item_name,
                }))}
              fallback={restaurant.store_img || '/img/placeholder.png'}
              alt={restaurant.restaurant_name}
              restaurant={restaurant}
              getIsOpen={getIsOpen}
            />
            {/* Premium Store Details Overlay (always visible) */}
            <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
              <div className="w-full px-5 md:px-8 pb-5 md:pb-8 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl">
                <div className="max-w-3xl">
                  <h1 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-2xl tracking-tight">
                    {restaurant.restaurant_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {restaurant.cuisine_type && (
                      <span className="bg-white/20 px-3 py-1 rounded-lg font-bold text-xs border border-white/30">
                        <i className="fas fa-utensils"></i> {restaurant.cuisine_type}
                      </span>
                    )}
                    {restaurant.address && (
                      <span className="bg-white/20 px-3 py-1 rounded-lg font-bold text-xs border border-white/30">
                        <i className="fas fa-map-marker-alt"></i> {restaurant.address}
                      </span>
                    )}
                    {restaurant.phone && (
                      <span className="bg-white/20 px-3 py-1 rounded-lg font-bold text-xs border border-white/30">
                        <i className="fas fa-phone"></i> {restaurant.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Verification Status */}
                    {restaurant.is_verified ? (
                      <span className="bg-green-600/80 px-3 py-1 rounded-lg font-bold text-xs border border-green-300 text-white flex items-center gap-1">
                        <i className="fas fa-check-circle"></i> Verified
                      </span>
                    ) : (
                      <span className="bg-red-600/80 px-3 py-1 rounded-lg font-bold text-xs border border-red-300 text-white flex items-center gap-1">
                        <i className="fas fa-times-circle"></i> Not Verified
                      </span>
                    )}
                    {/* Open/Closed Status */}
                    {getIsOpen(restaurant) ? (
                      <span className="bg-green-500/80 px-3 py-1 rounded-lg font-bold text-xs border border-green-300 text-white flex items-center gap-1">
                        <i className="fas fa-door-open"></i> Open Now
                      </span>
                    ) : (
                      <span className="bg-gray-500/80 px-3 py-1 rounded-lg font-bold text-xs border border-gray-300 text-white flex items-center gap-1">
                        <i className="fas fa-door-closed"></i> Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar - Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Delivery Time Card (with avg) */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-clock text-white text-lg"></i>
            </div>
            <p className="text-xs text-gray-600 font-semibold text-center mb-1">Delivery Time</p>
            <p className="text-lg font-black text-gray-900 text-center">
              {restaurant.delivery_time_minutes ? `${restaurant.delivery_time_minutes} min` : 'N/A'}
              {restaurant.delivery_time_minutes && <span className="block text-xs font-normal text-gray-500">Avg</span>}
            </p>
          </div>
          {/* Min. Order Card (icon visible and larger) */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-motorcycle text-white text-3xl"></i>
            </div>
            <p className="text-xs text-gray-600 font-semibold text-center mb-1">Min. Order</p>
            <p className="text-lg font-black text-gray-900 text-center">₹199</p>
          </div>
          {/* Rating Card (actual from table) */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-award text-white text-lg"></i>
            </div>
            <p className="text-xs text-gray-600 font-semibold text-center mb-1">Rating</p>
            <p className="text-lg font-black text-gray-900 text-center">
              {restaurant.avg_rating !== undefined && restaurant.avg_rating !== null ? `${restaurant.avg_rating} ★` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row-reverse gap-6">
          {/* Left Sidebar - Enhanced */}
          <div ref={sidebarRef} className="lg:w-1/4">
            <div className={`${isTabsSticky ? 'lg:sticky lg:top-6 z-30 h-[calc(100vh-120px)]' : ''} bg-white rounded-2xl shadow-lg p-4 border border-gray-200 flex flex-col`}>
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
          <div className="lg:w-3/4 pl-4 lg:pl-6">
            {/* Tab Navigation - Enhanced */}
            <div 
              ref={tabsRef}
              className={`bg-white shadow-lg mb-6 border border-gray-200 overflow-hidden transition-all duration-300 ${isTabsSticky ? 'lg:sticky lg:top-6 lg:w-full rounded-xl z-20' : 'rounded-2xl'}`}
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
                                {item.image_url ? (
                                  <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
                                    <Image
                                      src={item.image_url}
                                      alt={item.item_name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                ) : (
                                  <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <i className="fas fa-utensils text-3xl text-gray-300"></i>
                                  </div>
                                )}
                                <div className="flex-1 p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-1">
                                        {item.item_name}
                                        {item.category_item && (
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.category_item.toUpperCase() === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <i className={`fas ${item.category_item.toUpperCase() === 'VEG' ? 'fa-leaf' : 'fa-drumstick-bite'} mr-1`}></i>
                                            {item.category_item}
                                          </span>
                                        )}
                                        {item.customizations && item.customizations.length > 0 && (
                                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                            <i className="fas fa-cogs mr-1"></i> Customizable
                                          </span>
                                        )}
                                        {item.offer_price && item.offer_price < item.price && (
                                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                            <i className="fas fa-tag mr-1"></i> Offer
                                          </span>
                                        )}
                                      </h3>
                                      <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <i className="fas fa-tag"></i>
                                          {item.category}
                                        </span>
                                        {item.category_item && (
                                          <span className="flex items-center gap-1">
                                            <i className="fas fa-layer-group"></i>
                                            {item.category_item}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-xl font-black text-[#FF6B35]">
                                      {item.offer_price && item.offer_price < item.price ? (
                                        <>
                                          <span className="line-through text-gray-400 mr-2">₹{item.price}</span>
                                          ₹{item.offer_price}
                                        </>
                                      ) : (
                                        <>₹{item.price}</>
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                      {item.in_stock === false && (
                                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-400 px-3 py-1 rounded-full">
                                          <i className="fas fa-times-circle text-xs"></i>
                                          Out of Stock
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
                                            onClick={(e) => handleAddToCart(item.id, item.item_name, e.currentTarget as HTMLElement)}
                                            className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:scale-110 transition-all duration-200 shadow-sm"
                                          >
                                            <i className="fas fa-plus"></i>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={(e) => handleAddToCart(item.id, item.item_name, e.currentTarget as HTMLElement)}
                                          className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                                          disabled={item.in_stock === false}
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
                        <p className="text-gray-700 leading-relaxed mb-4">&quot;The biryani was absolutely amazing! Perfectly cooked rice, tender chicken pieces, and just the right amount of spices. Delivery was quick and the food arrived piping hot. Definitely ordering again!&quot;</p>
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
                        <p className="text-gray-700 leading-relaxed mb-4">&quot;Loved the chappathis and kurma combo! The chappathis were soft and fresh, and the kurma had the perfect balance of flavors. The packaging was excellent and the quantity was sufficient for two people. Great value for money!&quot;</p>
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

      {/* Restaurant Switch Confirmation Modal */}
      <RestaurantSwitchModal
        isOpen={showSwitchModal}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        currentRestaurantName={currentCartRestaurantName || 'Previous Restaurant'}
        newRestaurantName={restaurant.name}
      />
    </div>
  )
}

export default RestaurantPage;