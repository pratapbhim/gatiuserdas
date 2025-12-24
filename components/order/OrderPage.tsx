'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import OrderHeader from './OrderHeader'
import CategoriesSection from './CategoriesSection'
import RestaurantsSection from './RestaurantsSection'
import RestaurantDetailPage from './RestaurantDetailPage'
import Footer from '@/components/layout/Footer'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  restaurantName: string
}

export default function OrderPage() {
  const router = useRouter()
  const { items, total, addToCart, removeFromCart, updateItemQuantity, restaurantName } = useCart()
  
  const [currentView, setCurrentView] = useState<'categories' | 'restaurants'>('categories')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [vegOnly, setVegOnly] = useState(false)

  const cartCount = items.length

  const handleAddToCart = (item: CartItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: selectedRestaurantId?.toString(),
      restaurantName: item.restaurantName,
    })
  }

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateItemQuantity(itemId, quantity)
  }

  if (selectedRestaurantId) {
    return (
      <>
        <OrderHeader cartCount={cartCount} onCartClick={() => router.push('/cart')} />
        <RestaurantDetailPage 
          restaurantId={selectedRestaurantId}
          onBack={() => setSelectedRestaurantId(null)}
          onAddToCart={handleAddToCart}
        />
        <Footer />
      </>
    )
  }

  return (
    <>
      <OrderHeader cartCount={cartCount} onCartClick={() => router.push('/cart')} />
      {currentView === 'categories' ? (
        <CategoriesSection 
          onViewRestaurants={() => setCurrentView('restaurants')} 
          vegOnly={vegOnly}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <RestaurantsSection 
          onSelectRestaurant={setSelectedRestaurantId}
          onBackToCategories={() => setCurrentView('categories')}
          vegOnly={vegOnly}
        />
      )}
      <Footer />
    </>
  )
}

