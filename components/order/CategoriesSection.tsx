'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CartItem } from './OrderPage'

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
  const [selectedPriceCard, setSelectedPriceCard] = useState<string | null>(null)

  const priceCards: PriceCard[] = [
    {
      id: 'budget',
      price: 99,
      title: "Budget Meals",
      desc: "Delicious meals under ₹99",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [0, 99]
    },
    {
      id: 'mid',
      price: 149,
      title: "Value Meals",
      desc: "Great food at ₹100-₹149",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [100, 149]
    },
    {
      id: 'premium',
      price: 199,
      title: "Premium Delights",
      desc: "Quality dishes at ₹150-₹199",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [150, 199]
    },
    {
      id: 'feast',
      price: 249,
      title: "Feast Special",
      desc: "Larger portions at ₹200-₹249",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [200, 249]
    },
    {
      id: 'luxury',
      price: 299,
      title: "Luxury Dishes",
      desc: "Premium items at ₹250-₹299",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [250, 299]
    },
    {
      id: 'gourmet',
      price: 399,
      title: "Gourmet",
      desc: "Fine dining items ₹300+",
      image: "https://images.unsplash.com/photo-1504674900945-da4cb6b2fde1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      priceRange: [300, 500]
    },
  ]

  // Mock restaurant items data - in real app, this would come from API
  const restaurantItems: Record<string, RestaurantWithItems[]> = {
    budget: [
      {
        id: 1,
        name: "Delhi Darbar Dhaba",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        items: [
          { name: "Plain Naan", price: 40, image: "https://images.unsplash.com/photo-1618653053639-01d49e7c628a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Chole Bhature", price: 80, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Aloo Paratha", price: 70, image: "https://images.unsplash.com/photo-1585032226651-759b98d7e84e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        ]
      },
    ],
    mid: [
      {
        id: 2,
        name: "Burger King",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        items: [
          { name: "Whopper Burger", price: 119, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Cheese Burger", price: 99, image: "https://images.unsplash.com/photo-1550547990-25967502a51b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Chicken Fries", price: 129, image: "https://images.unsplash.com/photo-1518080353714-35080b653ba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        ]
      },
    ],
    premium: [
      {
        id: 3,
        name: "Pizza Hut",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        items: [
          { name: "Margherita Pizza", price: 180, image: "https://images.unsplash.com/photo-1628840042765-356cda07f4af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Veggie Pizza", price: 150, image: "https://images.unsplash.com/photo-1511689915661-18d5c0f4d4fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        ]
      },
    ],
    feast: [
      {
        id: 4,
        name: "Haldiram's",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        items: [
          { name: "Chole Bhature Combo", price: 220, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { name: "Raj Kachori", price: 200, image: "https://images.unsplash.com/photo-1585032226651-759b98d7e84e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        ]
      },
    ],
  }

  const categories = [
    { id: 1, name: "Biryani", icon: "fas fa-utensils", count: 45, color: "#FF6B6B" },
    { id: 2, name: "Burger", icon: "fas fa-hamburger", count: 32, color: "#4ECDC4" },
    { id: 3, name: "Pizza", icon: "fas fa-pizza-slice", count: 38, color: "#FFD166" },
    { id: 4, name: "Thali", icon: "fas fa-drumstick-bite", count: 28, color: "#9D4EDD" },
    { id: 5, name: "Momos", icon: "fas fa-cloud-meatball", count: 22, color: "#EF476F" },
    { id: 6, name: "Chinese", icon: "fas fa-utensil-spoon", count: 41, color: "#06D6A0" },
    { id: 7, name: "South Indian", icon: "fas fa-mortar-pestle", count: 36, color: "#118AB2" },
    { id: 8, name: "Desserts", icon: "fas fa-ice-cream", count: 29, color: "#FF9E6D" },
    { id: 9, name: "Beverages", icon: "fas fa-mug-hot", count: 25, color: "#A663CC" },
    { id: 10, name: "Street Food", icon: "fas fa-stand", count: 52, color: "#EE6C4D" },
    { id: 11, name: "North Indian", icon: "fas fa-bread-slice", count: 47, color: "#38B000" },
    { id: 12, name: "Italian", icon: "fas fa-cheese", count: 31, color: "#3A86FF" },
  ]

  const offers = [
    { price: "Deals @ ₹99", title: "Budget Meals", desc: "Starting at just ₹99, enjoy delicious meals", icon: "fas fa-bolt" },
    { price: "Buy 1 Get 1", title: "Double Treat", desc: "Buy any pizza and get another one free", icon: "fas fa-gift" },
    { price: "Quick Bites", title: "Fast Delivery", desc: "Get your food delivered in under 30 minutes", icon: "fas fa-motorcycle" },
    { price: "Flat ₹120 Off", title: "First Order", desc: "Use code GATIMITRA120 on your first order", icon: "fas fa-percent" },
  ]

  // Auto-scroll ref for lowest prices section
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f0f0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[5%] py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#1A1A2E] to-[#FF6B6B] bg-clip-text text-transparent mb-2">
            Food Categories
          </h1>
          <p className="text-[#6C757D] text-sm sm:text-base max-w-2xl">
            Browse food by category and discover new favorites from the best restaurants
          </p>
        </div>

        {/* Exclusive Offers */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">🎉 Exclusive Offers</h2>
            <a href="#" className="text-[#FF6B6B] text-sm font-semibold hover:text-[#FF8E8E] transition-colors">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`text-white rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl border border-opacity-20 border-white group ${
                  index === 0 ? 'bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] hover:from-[#FF5252] hover:via-[#FF7A7A] hover:to-[#FFA3A3]' :
                  index === 1 ? 'bg-gradient-to-br from-[#4ECDC4] via-[#6BE0D8] to-[#A8F0E8] hover:from-[#2DB5AF] hover:via-[#3DCCC4] hover:to-[#8FE8DE]' :
                  index === 2 ? 'bg-gradient-to-br from-[#FFD166] via-[#FFDF8E] to-[#FFF0B3] hover:from-[#FFC94D] hover:via-[#FFD97A] hover:to-[#FFE699]' :
                  'bg-gradient-to-br from-[#9D4EDD] via-[#C77DFF] to-[#E0AAFF] hover:from-[#8A35D1] hover:via-[#B05FFF] hover:to-[#D89FFF]'
                }`}
              >
                <div className="text-4xl sm:text-5xl font-extrabold mb-3 group-hover:scale-110 transition-transform origin-left">
                  <i className={offer.icon}></i>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold mb-2">{offer.price}</div>
                <div className="text-lg sm:text-xl font-bold mb-2">{offer.title}</div>
                <div className="text-sm sm:text-base opacity-95">{offer.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold my-6 sm:my-8 text-[#1A1A2E]">🍽️ Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/restaurants?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-300 shadow-md border-2 border-transparent hover:-translate-y-3 hover:shadow-2xl hover:border-[#FF6B6B] hover:bg-gradient-to-br hover:from-white hover:to-[#FFE6E6] block no-underline"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-2xl sm:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  <i className={category.icon}></i>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#1A1A2E] mb-1 group-hover:text-[#FF6B6B] transition-colors">
                  {category.name}
                </div>
                <div className="text-xs sm:text-sm text-[#6C757D] font-medium">
                  {category.count} restaurants
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Lowest Prices Ever */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold my-6 sm:my-8 text-[#1A1A2E]">💰 Lowest Prices Ever</h2>
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {priceCards.map((card, index) => (
              <div key={card.id} className="relative">
                {/* Hover Popup Image */}
                {hoveredCard === card.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[60] animate-in fade-in zoom-in duration-200">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-48 h-48 rounded-2xl object-cover shadow-2xl"
                    />
                  </div>
                )}

                {/* Card */}
                <div
                  onClick={() => setSelectedPriceCard(card.id)}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`min-w-[280px] sm:min-w-[320px] text-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer hover:shadow-2xl snap-start group ${
                    hoveredCard === card.id ? '-translate-y-3' : ''
                  } ${
                    index === 0 ? 'bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] hover:from-[#FF5252] hover:via-[#FF7A7A] hover:to-[#FFA3A3]' :
                    index === 1 ? 'bg-gradient-to-br from-[#4ECDC4] via-[#6BE0D8] to-[#A8F0E8] hover:from-[#2DB5AF] hover:via-[#3DCCC4] hover:to-[#8FE8DE]' :
                    index === 2 ? 'bg-gradient-to-br from-[#FFD166] via-[#FFDF8E] to-[#FFF0B3] hover:from-[#FFC94D] hover:via-[#FFD97A] hover:to-[#FFE699]' :
                    index === 3 ? 'bg-gradient-to-br from-[#9D4EDD] via-[#C77DFF] to-[#E0AAFF] hover:from-[#8A35D1] hover:via-[#B05FFF] hover:to-[#D89FFF]' :
                    index === 4 ? 'bg-gradient-to-br from-[#FF9A8B] via-[#FF7A7A] to-[#FF6B6B] hover:from-[#FF8870] hover:via-[#FF6060] hover:to-[#FF5252]' :
                    'bg-gradient-to-br from-[#A9C9FF] via-[#9BBEF5] to-[#FFBBEC] hover:from-[#94B8FF] hover:via-[#85ADEF] hover:to-[#FFAAE3]'
                  }`}
                >
                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="text-3xl sm:text-4xl font-extrabold mb-2">
                      ₹{card.price}
                    </div>
                    <div className="text-lg sm:text-xl font-bold mb-1">{card.title}</div>
                    <div className="text-xs sm:text-sm opacity-90 mb-4">{card.desc}</div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/30">
                      <span className="text-xs sm:text-sm font-semibold">Tap to see items</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                  {priceCards.find(c => c.id === selectedPriceCard)?.title}
                </h2>
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
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md"
                          />
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">{restaurant.name}</h3>
                            <p className="text-sm text-[#6C757D]">{restaurant.items.length} items available</p>
                          </div>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {restaurant.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
                            >
                              {/* Item Image */}
                              <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>

                              {/* Item Info */}
                              <div className="p-4">
                                <h4 className="font-bold text-[#1A1A2E] text-sm sm:text-base mb-2 line-clamp-2">
                                  {item.name}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-[#16c2a5] to-[#ff6b35] bg-clip-text text-transparent">
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
                                    className="bg-gradient-to-r from-[#16c2a5] to-[#0fa589] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-lg transition-all hover:scale-105">
                                    <i className="fas fa-plus"></i>
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
                    <i className="fas fa-inbox text-6xl text-[#ddd] mb-4"></i>
                    <p className="text-lg text-[#6C757D]">No items available in this price range yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

