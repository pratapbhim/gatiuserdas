'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'
import AuthModal from '@/components/auth/AuthModal'
import Footer from '@/components/layout/Footer'

export default function RidePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [showReserve, setShowReserve] = useState(false)
  const [reserveDate, setReserveDate] = useState('')
  const [reserveTime, setReserveTime] = useState('')

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-[1000] py-4 px-[5%]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <Link href="/" className="text-3xl font-extrabold text-[#00B4D8] flex items-center gap-2">
            <i className="fas fa-bolt text-[#0077B6]"></i>
            GatiMitra
          </Link>
          <nav className="flex gap-8">
            <Link href="/courier" className="text-[#1A1A2E] font-medium transition-colors hover:text-[#00B4D8]">Courier</Link>
            <Link href="/ride" className="text-[#00B4D8] font-medium border-b-2 border-[#00B4D8] pb-1">Ride</Link>
            <Link href="/order" className="text-[#1A1A2E] font-medium transition-colors hover:text-[#00B4D8]">Food</Link>
          </nav>
          {isAuthenticated && user ? (
            <div className="text-[#00B4D8] font-semibold">{user.name || user.phone}</div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white text-[#00B4D8] border-2 border-[#00B4D8] px-6 py-2.5 rounded-[30px] font-semibold cursor-pointer transition-all hover:bg-[#00B4D8] hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#00B4D8]/10 to-[#0077B6]/5 py-20 px-[5%] text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-5xl font-extrabold mb-5 text-[#1A1A2E] leading-tight">Ride</h1>
          <p className="text-2xl text-[#6C757D] mb-10 font-medium">Request a ride for now or later</p>
          <div className="bg-[#FF6B35] text-white px-6 py-3 rounded-[30px] inline-block font-semibold mb-10 shadow-md">
            <i className="fas fa-tag mr-2"></i>
            Up to 90% off your first 3 GatiMitra rides. T&C apply.*
            <div className="text-sm mt-1">*Valid within 15 days of signup.</div>
          </div>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto -mt-[60px] mb-20 px-[5%]">
        <div className="bg-white rounded-xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold mb-2.5 text-[#1A1A2E]">Request a ride</h2>
          <p className="text-[#6C757D] mb-8 text-base">Go anywhere with GatiMitra. Safe, reliable rides at your fingertips.</p>
          
          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-2.5 text-[#1A1A2E] text-base">Pickup location</label>
              <div className="relative">
                <i className="fas fa-map-marker-alt absolute left-[18px] top-1/2 -translate-y-1/2 text-[#6C757D]"></i>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full pl-[50px] pr-5 py-4 rounded-xl border border-[#ddd] text-base transition-all bg-[#f8f9fa] focus:outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,0.1)] focus:bg-white"
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
                  placeholder="Where to?"
                  className="w-full pl-[50px] pr-5 py-4 rounded-xl border border-[#ddd] text-base transition-all bg-[#f8f9fa] focus:outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,0.1)] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-5 mt-8 flex-wrap">
              <button
                type="button"
                className="flex-1 min-w-[200px] py-4 rounded-xl text-lg font-bold cursor-pointer transition-all border-none bg-[#00B4D8] text-white hover:bg-[#0099C1] hover:-translate-y-1 hover:shadow-xl"
              >
                <i className="fas fa-search-dollar mr-2"></i> See prices
              </button>
              <button
                type="button"
                onClick={() => setShowReserve(true)}
                className="flex-1 min-w-[200px] py-4 rounded-xl text-lg font-bold cursor-pointer transition-all border-2 border-[#ddd] bg-[#F8F9FA] text-[#1A1A2E] hover:border-[#00B4D8] hover:text-[#00B4D8] hover:-translate-y-1 hover:shadow-xl"
              >
                <i className="fas fa-calendar-alt mr-2"></i> Schedule for later
              </button>
            </div>
          </form>
        </div>
      </section>

      {showReserve && (
        <section className="py-20 px-[5%] bg-[#f8f9fa]">
          <div className="max-w-[800px] mx-auto bg-white rounded-xl p-12 shadow-md">
            <h2 className="text-3xl font-extrabold mb-2.5 text-[#1A1A2E] text-center">Plan for later</h2>
            <p className="text-center text-[#6C757D] mb-10 text-lg">Get your ride right with GatiMitra Reserve</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-[#F8F9FA] p-6 rounded-xl">
                <div className="font-bold mb-4 text-[#1A1A2E] text-lg flex items-center gap-2.5">
                  <i className="fas fa-calendar-day"></i> Choose date
                </div>
                <input
                  type="date"
                  value={reserveDate}
                  onChange={(e) => setReserveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-4 rounded-xl border border-[#ddd] text-base transition-all focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
              <div className="bg-[#F8F9FA] p-6 rounded-xl">
                <div className="font-bold mb-4 text-[#1A1A2E] text-lg flex items-center gap-2.5">
                  <i className="fas fa-clock"></i> Choose time
                </div>
                <input
                  type="time"
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-[#ddd] text-base transition-all focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>

            <button className="bg-[#00B4D8] text-white border-none px-10 py-4 rounded-[30px] text-lg font-bold cursor-pointer transition-all block mx-auto hover:bg-[#0099C1] hover:-translate-y-1 hover:shadow-xl">
              <i className="fas fa-arrow-right mr-2"></i> Next
            </button>
          </div>
        </section>
      )}

      <section className="py-20 px-[5%]">
        <h2 className="text-center text-4xl font-extrabold mb-15 text-[#1A1A2E]">Choose Your Ride</h2>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: 'fa-car', title: 'GatiMitra Go', price: '₹120-180', desc: 'Affordable, everyday rides' },
            { icon: 'fa-car-side', title: 'GatiMitra Comfort', price: '₹200-300', desc: 'Newer cars with extra legroom' },
            { icon: 'fa-shield-alt', title: 'GatiMitra Premier', price: '₹350-500', desc: 'Top-rated drivers, luxury cars' },
            { icon: 'fa-users', title: 'GatiMitra Share', price: '₹80-120', desc: 'Share your ride, split the cost' },
          ].map((ride, index) => (
            <div key={index} className="rounded-xl p-8 text-center transition-all border-2 border-[#eee] hover:-translate-y-2.5 hover:shadow-xl hover:border-[#00B4D8]">
              <div className="text-5xl text-[#00B4D8] mb-5">
                <i className={`fas ${ride.icon}`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A2E]">{ride.title}</h3>
              <div className="text-[#00B4D8] font-extrabold text-xl mb-4">{ride.price}</div>
              <p className="text-[#6C757D] mb-5">{ride.desc}</p>
              <button className="bg-[#00B4D8] text-white border-none px-6 py-3 rounded-[30px] font-semibold cursor-pointer transition-all w-full hover:bg-[#0099C1]">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Footer />
    </>
  )
}

