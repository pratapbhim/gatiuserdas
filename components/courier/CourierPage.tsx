'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'
import AuthModal from '@/components/auth/AuthModal'
import Footer from '@/components/layout/Footer'

export default function CourierPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-[1000] py-4 px-[5%]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <Link href="/" className="text-3xl font-extrabold text-[#FF6B6B] flex items-center gap-2">
            <i className="fas fa-bolt text-[#4ECDC4]"></i>
            GatiMitra
          </Link>
          <nav className="flex gap-8">
            <Link href="/courier" className="text-[#FF6B6B] font-medium border-b-2 border-[#FF6B6B] pb-1">Courier</Link>
            <Link href="/ride" className="text-[#1A1A2E] font-medium transition-colors hover:text-[#FF6B6B]">Ride</Link>
            <Link href="/order" className="text-[#1A1A2E] font-medium transition-colors hover:text-[#FF6B6B]">Food</Link>
          </nav>
          {isAuthenticated && user ? (
            <div className="text-[#FF6B6B] font-semibold">{user.name || user.phone}</div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white text-[#FF6B6B] border-2 border-[#FF6B6B] px-6 py-2.5 rounded-[30px] font-semibold cursor-pointer transition-all hover:bg-[#FF6B6B] hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#4ECDC4]/5 py-20 px-[5%] text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-5xl font-extrabold mb-5 text-[#1A1A2E] leading-tight">Courier: for the things you need done now</h1>
          <p className="text-xl text-[#6C757D] mb-10">
            For everyday errands and small business to-dos, including <span className="text-[#FF6B6B] font-bold">same-day delivery</span> and more.
          </p>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto -mt-[60px] mb-20 px-[5%]">
        <div className="bg-white rounded-xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold mb-2.5 text-[#1A1A2E] text-center">Send anything, anywhere</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-2.5 text-[#1A1A2E] text-base">Pickup location</label>
              <div className="relative">
                <i className="fas fa-map-marker-alt absolute left-[18px] top-1/2 -translate-y-1/2 text-[#6C757D]"></i>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address"
                  className="w-full pl-[50px] pr-5 py-4 rounded-xl border border-[#ddd] text-base transition-all bg-[#f8f9fa] focus:outline-none focus:border-[#4ECDC4] focus:shadow-[0_0_0_3px_rgba(78,205,196,0.2)] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center my-4">
              <button
                type="button"
                onClick={() => {
                  const temp = pickup
                  setPickup(dropoff)
                  setDropoff(temp)
                }}
                className="bg-[#E0F7FF] text-[#00B4D8] border-none w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[#00B4D8] hover:text-white hover:rotate-180"
              >
                <i className="fas fa-exchange-alt"></i>
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-2.5 text-[#1A1A2E] text-base">Dropoff location</label>
              <div className="relative">
                <i className="fas fa-flag-checkered absolute left-[18px] top-1/2 -translate-y-1/2 text-[#6C757D]"></i>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter delivery address"
                  className="w-full pl-[50px] pr-5 py-4 rounded-xl border border-[#ddd] text-base transition-all bg-[#f8f9fa] focus:outline-none focus:border-[#4ECDC4] focus:shadow-[0_0_0_3px_rgba(78,205,196,0.2)] focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF6B6B] text-white border-none py-4 rounded-xl text-lg font-bold cursor-pointer transition-all hover:bg-[#ff5252] hover:-translate-y-1 hover:shadow-xl"
            >
              <i className="fas fa-paper-plane mr-2"></i> Send item
            </button>
          </form>
        </div>
      </section>

      <section className="py-20 px-[5%] bg-white">
        <h2 className="text-center text-4xl font-extrabold mb-15 text-[#1A1A2E]">Why Choose GatiMitra Courier?</h2>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: 'fa-bolt', title: 'Fast Delivery', desc: 'Get your items delivered within hours. Same-day delivery available in most areas.' },
            { icon: 'fa-shield-alt', title: 'Secure & Tracked', desc: 'Real-time tracking and secure handling for all your deliveries.' },
            { icon: 'fa-rupee-sign', title: 'Affordable Pricing', desc: 'Transparent pricing with no hidden fees. Pay only for what you need.' },
          ].map((feature, index) => (
            <div key={index} className="text-center p-8">
              <div className="w-20 h-20 bg-[#FFE8E0] rounded-full flex items-center justify-center mx-auto mb-5 text-4xl text-[#FF6B6B]">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A2E]">{feature.title}</h3>
              <p className="text-[#6C757D] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Footer />
    </>
  )
}

