'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import CustomizeModal from '@/components/cart/CustomizeModal'
import { useState } from 'react'

export default function CartPage() {
  const router = useRouter()
  const { items, total, removeFromCart, updateItemQuantity, restaurantName, clearCartItems, updateItemOptions } = useCart()
  const [customOpen, setCustomOpen] = useState(false)
  const [customCartEntry, setCustomCartEntry] = useState<any | null>(null)

  // Basic options map for context-aware add-ons / sizes per productId
  const optionsMap: Record<string, any> = {
    '1': { basePrice: 280, sizes: [{ id: 's', name: 'Small', price: 0 }, { id: 'm', name: 'Regular', price: 40 }, { id: 'l', name: 'Large', price: 80 }], addons: [{ id: 'a1', name: 'Extra Paneer', price: 60 }, { id: 'a2', name: 'Extra Gravy', price: 40 }] },
    '2': { basePrice: 320, sizes: [{ id: 'r', name: 'Regular', price: 0 }, { id: 'h', name: 'Half', price: -80 }, { id: 'f', name: 'Family', price: 200 }], addons: [{ id: 'a3', name: 'Boiled Egg', price: 20 }, { id: 'a4', name: 'Cold Drink', price: 50 }] },
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateItemQuantity(itemId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 mb-6 shadow-sm border border-gray-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shopping-cart text-gray-400 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => router.push('/restaurants')}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 py-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200 mb-4"
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-600 text-sm">{restaurantName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <i className="fas fa-shopping-bag text-gray-400 text-2xl"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            {item.size && <p className="text-sm text-gray-600">Size: {item.size.name}</p>}
                            {item.addons && item.addons.length > 0 && (
                              <p className="text-sm text-gray-600">Add-ons: {item.addons.map(a => a.name).join(', ')}</p>
                            )}
                            <p className="text-sm text-gray-600">Unit: ₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <i className="fas fa-trash text-sm"></i>
                            </button>
                            {optionsMap[item.productId] && (
                              <button
                                onClick={() => { setCustomCartEntry(item); setCustomOpen(true) }}
                                className="ml-3 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                              >
                                Customize
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-6 h-fit">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">₹35</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax & Charges</span>
                  <span className="font-semibold text-gray-900">₹{(total * 0.05).toFixed(0)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{(total + 35 + Math.round(total * 0.05)).toFixed(0)}</span>
              </div>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all mb-3">
                Proceed to Checkout
              </button>
              <button
                onClick={() => router.back()}
                className="w-full px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Customize modal mount inside top-level container */}
      <_RenderCartCustomize
        open={customOpen}
        entry={customCartEntry}
        onClose={() => { setCustomOpen(false); setCustomCartEntry(null) }}
        optionsMap={optionsMap}
        onConfirm={(selection: any) => {
          if (!customCartEntry) return
          updateItemOptions(customCartEntry.id, optionsMap[customCartEntry.productId].basePrice, { size: selection.size, addons: selection.addons }, selection.quantity)
          setCustomOpen(false)
          setCustomCartEntry(null)
        }}
      />
    </div>
  )
}

// Render the customize modal using component state
export function _RenderCartCustomize({ open, entry, onClose, optionsMap, onConfirm }: any) {
  if (!open || !entry) return null
  const opts = optionsMap[entry.productId]
  if (!opts) return null

  const modalItem = {
    id: entry.productId,
    name: entry.name,
    basePrice: opts.basePrice,
    sizes: opts.sizes,
    addons: opts.addons,
    image: undefined,
  }

  return (
    <CustomizeModal
      open={open}
      onClose={onClose}
      item={modalItem}
      onConfirm={(selection: any) => onConfirm(selection)}
    />
  )
}

// Customize modal (Cart page) - opens for cart entry edits
function CartCustomizeWrapper({ open, entry, onClose, onConfirm, optionsMap }: any) {
  if (!open || !entry) return null
  const opts = optionsMap[entry.productId]
  if (!opts) return null

  const modalItem = {
    id: entry.productId,
    name: entry.name,
    basePrice: opts.basePrice,
    sizes: opts.sizes,
    addons: opts.addons,
    image: undefined,
  }

  return (
    <CustomizeModal
      open={open}
      onClose={onClose}
      item={modalItem}
      onConfirm={(selection: any) => onConfirm(selection)}
    />
  )
}

// Render wrapper modal at module level to avoid hooks in loops
// Render modal from inside component
/* Modal insertion handled in main component via state: */
