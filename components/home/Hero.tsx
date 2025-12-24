'use client'

import Search from '@/components/common/Search'

export default function Hero() {
  return (
    <div className="text-center mt-10 relative z-10">
      <h1 className="text-5xl md:text-[48px] font-black leading-tight mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
        India&apos;s <span className="bg-gradient-to-br from-[#00ffd5] to-[#00c9ff] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,255,213,0.3)]">Lowest Commission</span>
        <br />Delivery Platform
      </h1>
      
      {/* Decorative flowing elements - LARGER & MORE VISIBLE */}
      <svg className="mx-auto mb-12 pointer-events-none w-full" width="1000" height="150" viewBox="0 0 1000 150" style={{minHeight: '150px'}}>
        {/* Left flowing wave with large dots */}
        <path d="M 100 75 Q 130 30, 160 75 Q 190 120, 220 75" stroke="#00ffd5" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="75" r="6" fill="#00ffd5" />
        <circle cx="220" cy="75" r="6" fill="#00ffd5" />
        <circle cx="160" cy="30" r="5" fill="#00c9ff" />
        <circle cx="160" cy="120" r="5" fill="#00c9ff" />
        
        {/* Center geometric starburst */}
        <circle cx="500" cy="75" r="35" stroke="#00c9ff" strokeWidth="3" fill="none" />
        <circle cx="500" cy="75" r="20" stroke="#00ffd5" strokeWidth="3" fill="none" />
        <line x1="500" y1="30" x2="500" y2="5" stroke="#00c9ff" strokeWidth="4" strokeLinecap="round" />
        <line x1="500" y1="145" x2="500" y2="120" stroke="#00c9ff" strokeWidth="4" strokeLinecap="round" />
        <line x1="465" y1="75" x2="440" y2="75" stroke="#00ffd5" strokeWidth="4" strokeLinecap="round" />
        <line x1="535" y1="75" x2="560" y2="75" stroke="#00ffd5" strokeWidth="4" strokeLinecap="round" />
        <line x1="470" y1="40" x2="455" y2="25" stroke="#00c9ff" strokeWidth="3" strokeLinecap="round" />
        <line x1="530" y1="110" x2="545" y2="125" stroke="#00c9ff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="500" cy="75" r="8" fill="#00ffd5" />
        
        {/* Right flowing curve with accent dots */}
        <path d="M 780 40 Q 820 75, 860 110" stroke="#00c9ff" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="780" cy="40" r="6" fill="#00ffd5" />
        <circle cx="860" cy="110" r="6" fill="#00c9ff" />
        <circle cx="820" cy="75" r="4" fill="#00ffd5" />
        <circle cx="795" cy="55" r="4" fill="#00c9ff" />
        <circle cx="845" cy="95" r="4" fill="#00ffd5" />
        <circle cx="810" cy="65" r="3" fill="#00c9ff" opacity="0.7" />
        <circle cx="835" cy="85" r="3" fill="#00ffd5" opacity="0.7" />
      </svg>
      <p className="text-lg font-medium opacity-95 mb-2.5 tracking-wide">
        Food • Parcel • Person Delivery
      </p>

      <div className="mt-12 mx-auto max-w-[850px] text-black bg-white/85 flex items-center rounded-[50px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.25)] border border-white/35 backdrop-blur-[6px] relative z-20">
        <div className="relative before:absolute before:inset-[-2px] before:bg-gradient-to-br before:from-pink before:to-bg before:rounded-[52px] before:-z-10 before:opacity-55"></div>
        <input
          className="w-[240px] px-6 py-5.5 bg-white/90 border-r border-black/8 text-text font-medium"
          placeholder="📍 Detecting location…"
          readOnly
        />
        <Search 
          placeholder="🔍 Search for brands, stores & services…"
          className="flex-1"
        />
      </div>
    </div>
  )
}

