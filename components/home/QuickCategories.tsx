'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function QuickCategories() {
  const [showVoucherPopup, setShowVoucherPopup] = useState(false)

  const categories = [
    {
      tag: 'Food Delivery',
      title: 'Order Your Meal',
      image: 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
      href: '/order',
    },
    {
      tag: 'Powered by GatiMitra',
      title: 'Book Your Ride',
      image: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
      href: '/ride',
    },
    {
      tag: 'Send & Receive',
      title: 'Book Your Parcel',
      image: 'https://cdn-icons-png.flaticon.com/512/679/679922.png',
      href: '/courier',
    },
    {
      tag: 'Deals & Offers',
      title: 'Online Vouchers',
      image: 'https://cdn-icons-png.flaticon.com/512/891/891419.png',
      href: '#',
      onClick: () => setShowVoucherPopup(true),
    },
    {
      tag: 'Explore Nearby',
      title: 'Near Me',
      image: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      href: '#',
    },
  ]

  return (
    <>
      <section className="mt-[-100px] pb-[70px] relative z-20">
        <div className="flex justify-center gap-3 flex-wrap max-w-[1000px] mx-auto px-4">
          {categories.map((category, index) => {
            const cardContent = (
              <div 
                className="w-[150px] h-[160px] rounded-[16px] text-center cursor-pointer relative overflow-hidden group hover:-translate-y-[4px] transition-all duration-300"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#16c2a5] via-[#4b2ad4] to-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="flex flex-col items-center justify-center h-full px-3 py-4">
                    {/* Tag with leaf icon effect */}
                    <div className="relative mb-2">
                      <div className="bg-gradient-to-br from-[rgba(22,194,165,0.15)] to-[rgba(75,42,212,0.1)] text-purple text-[9px] rounded-[8px] font-bold px-2 py-0.5 inline-block tracking-wide border border-[rgba(22,194,165,0.2)]" style={{ letterSpacing: '0.2px' }}>
                        {category.tag}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-[14px] font-bold mb-2 text-text leading-tight px-1">{category.title}</h3>
                    
                    {/* Image */}
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-[55px] h-[55px] object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.1))' }}
                      />
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(22,194,165,0.06), transparent 70%)',
                      boxShadow: 'inset 0 0 40px rgba(22,194,165,0.05)'
                    }}
                  ></div>
                  
                  {/* Shine effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    }}
                  ></div>
              </div>
            )

            if (category.onClick) {
              return (
                <div 
                  key={index} 
                  onClick={category.onClick} 
                  className="cursor-pointer"
                >
                  {cardContent}
                </div>
              )
            }

            return (
              <Link key={index} href={category.href || '/'}>
                {cardContent}
              </Link>
            )
          })}
        </div>
      </section>

      {showVoucherPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[22px] max-w-[420px] text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)] animate-popupScale relative">
            <button
              onClick={() => setShowVoucherPopup(false)}
              className="absolute top-[18px] right-[22px] text-2xl cursor-pointer text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <h2 className="text-2xl mb-3 text-purple">Coming Soon 🚀</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              We&apos;re working on exciting deals & vouchers.<br />
              This feature will be live very soon on GatiMitra.
            </p>
            <button
              onClick={() => setShowVoucherPopup(false)}
              className="mt-5 px-7 py-3 border-none rounded-[30px] bg-gradient-to-br from-pink to-purple text-white font-semibold cursor-pointer hover:shadow-lg transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

