'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout, ServiceCategory, setCurrentService } from '@/lib/slices/authSlice'
import ServiceSwitchModal from './ServiceSwitchModal'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const serviceLabels: Record<ServiceCategory, { name: string; icon: string; color: string; route: string }> = {
  food: { name: 'Food Delivery', icon: 'fas fa-utensils', color: 'bg-orange-500', route: '/order' },
  person: { name: 'Ride Service', icon: 'fas fa-car', color: 'bg-blue-500', route: '/ride' },
  parcel: { name: 'Courier Service', icon: 'fas fa-box', color: 'bg-green-500', route: '/parcel' },
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { user, currentService } = useAppSelector(state => state.auth)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  const [targetService, setTargetService] = useState<ServiceCategory>('food')

  // Close logout confirm when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false)
      setShowSwitchModal(false)
    }
  }, [isOpen])

  if (!isOpen || !user) return null

  // All 3 services are always available
  const availableServices: ServiceCategory[] = user.services || ['food', 'person', 'parcel']

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  const formatPhoneNumber = (phone: string) => {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  }

  // Handle service click - ALWAYS show popup
  const handleServiceClick = (service: ServiceCategory) => {
    if (service === currentService) return // Don't switch to same service
    
    // ALWAYS show switch popup - every single time
    setTargetService(service)
    setShowSwitchModal(true)
  }

  // Handle switch confirmation
  const handleSwitchContinue = () => {
    dispatch(setCurrentService(targetService))
    setShowSwitchModal(false)
    onClose()
    // Navigate to the service page
    const route = serviceLabels[targetService].route
    router.push(route)
  }

  // Determine filter and from URL based on current pathname
  const getOrdersRedirectUrl = () => {
    // Decode pathname to handle encoded URLs
    const decodedPath = decodeURIComponent(pathname || '/')
    
    if (decodedPath.includes('/order')) {
      return '/orders?filter=food&from=%2Forder'
    } else if (decodedPath.includes('/ride')) {
      return '/orders?filter=person&from=%2Fride'
    } else if (decodedPath.includes('/courier') || decodedPath.includes('/parcel')) {
      return '/orders?filter=parcel&from=%2Fcourier'
    }
    // Default to all orders from home
    return '/orders?filter=all&from=%2F'
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal - Compact size */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        {/* Header with gradient - Reduced padding */}
        <div className="bg-gradient-to-r from-purple to-mint px-5 py-5 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
          
          {/* Profile avatar - Smaller */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-2 ring-2 ring-white/30">
              <i className="fas fa-user text-white text-xl"></i>
            </div>
            <h2 className="text-lg font-bold">{user.name || 'User'}</h2>
            <p className="text-white/80 text-xs mt-0.5">{formatPhoneNumber(user.phone)}</p>
            {user.email && (
              <p className="text-white/80 text-xs">{user.email}</p>
            )}
          </div>
        </div>
        
        {/* Content - No scrollbar */}
        <div className="p-4">
          {/* User ID Badge - Show GMMS ID */}
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-gradient-to-r from-purple/10 to-mint/10 border border-purple/20 px-3 py-1.5 rounded-full">
              <span className="text-xs text-gray-500">User ID: </span>
              <span className="font-mono font-bold text-purple text-sm">{user.user_id || user.id}</span>
            </div>
          </div>
          
          {/* Available Services - Clickable for switching */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Your Services <span className="text-green-500">(All Active)</span>
            </h3>
            <div className="space-y-1.5">
              {(['food', 'person', 'parcel'] as ServiceCategory[]).map((service) => {
                const info = serviceLabels[service]
                const isCurrent = service === currentService
                
                return (
                  <button 
                    key={service}
                    onClick={() => handleServiceClick(service)}
                    disabled={isCurrent}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-purple/10 to-mint/10 border border-purple/30 cursor-default' 
                        : 'bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-purple/30 cursor-pointer'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center`}>
                      <i className={`${info.icon} text-white text-xs`}></i>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {info.name}
                      </p>
                    </div>
                    {isCurrent ? (
                      <div className="bg-purple text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Active
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <span>Switch</span>
                        <i className="fas fa-chevron-right text-[10px]"></i>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Account Status - Compact */}
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">Account Status</span>
              <span className="text-green-600 font-medium flex items-center gap-1 text-xs">
                <i className="fas fa-circle text-[5px]"></i> Active
              </span>
            </div>
          </div>
          
          {/* My Orders Button */}
          <div className="mb-4">
            <button
              onClick={() => {
                onClose()
                window.location.href = getOrdersRedirectUrl()
              }}
              className="w-full px-3 py-2.5 bg-gradient-to-r from-purple to-mint text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <i className="fas fa-shopping-bag"></i>
              My Orders
            </button>
          </div>
          
          {/* Actions - Compact */}
          <div>
            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-3 py-2.5 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-xs mb-2 text-center">
                  Are you sure you want to logout?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Service Switch Modal - Shows every time user switches */}
      <ServiceSwitchModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        targetService={targetService}
        onContinue={handleSwitchContinue}
      />
    </div>
  )
}
