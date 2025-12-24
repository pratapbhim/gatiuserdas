'use client'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0c0c1a] to-[#121230] text-white py-12 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mint via-purple to-pink"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold mb-4 text-white relative pb-2">
            Quick Links
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mint rounded"></span>
          </h3>
          <ul className="list-none space-y-2">
            {[
              { icon: 'fa-home', text: 'Home', href: '/' },
              { icon: 'fa-utensils', text: 'Food Delivery', href: '/order' },
              { icon: 'fa-shipping-fast', text: 'Parcel Delivery', href: '/courier' },
              { icon: 'fa-user-friends', text: 'Person Delivery', href: '/ride' },
              { icon: 'fa-tags', text: 'Deals & Offers', href: '#' },
              { icon: 'fa-map-marker-alt', text: 'Around You', href: '#' },
            ].map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-[#b0b0d0] no-underline transition-all flex items-center text-[14px] font-medium hover:text-mint hover:translate-x-1">
                  <i className={`fas ${link.icon} mr-2 text-[13px] w-[18px] text-center text-mint`}></i>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-white relative pb-2">
            Company
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mint rounded"></span>
          </h3>
          <ul className="list-none space-y-2">
            {[
              { icon: 'fa-info-circle', text: 'About Us', href: '/about' },
              { icon: 'fa-newspaper', text: 'Blog', href: '#' },
              { icon: 'fa-bullhorn', text: 'Press', href: '#' },
              { icon: 'fa-users', text: 'Careers', href: '#' },
              { icon: 'fa-handshake', text: 'Partners', href: '#' },
              { icon: 'fa-shield-alt', text: 'Trust & Safety', href: '#' },
            ].map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-[#b0b0d0] no-underline transition-all flex items-center text-[14px] font-medium hover:text-mint hover:translate-x-1">
                  <i className={`fas ${link.icon} mr-2 text-[13px] w-[18px] text-center text-mint`}></i>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-white relative pb-2">
            Support
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mint rounded"></span>
          </h3>
          <ul className="list-none space-y-2">
            {[
              { icon: 'fa-question-circle', text: 'Help Center', href: '#' },
              { icon: 'fa-phone-alt', text: 'Contact Us', href: '#' },
              { icon: 'fa-exclamation-triangle', text: 'Report Issue', href: '#' },
              { icon: 'fa-comment-dots', text: 'Feedback', href: '#' },
              { icon: 'fa-file-alt', text: 'Terms & Conditions', href: '#' },
              { icon: 'fa-lock', text: 'Privacy Policy', href: '#' },
            ].map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-[#b0b0d0] no-underline transition-all flex items-center text-[14px] font-medium hover:text-mint hover:translate-x-1">
                  <i className={`fas ${link.icon} mr-2 text-[13px] w-[18px] text-center text-mint`}></i>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-white relative pb-2">
            Stay Connected
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mint rounded"></span>
          </h3>
          <div className="mt-4">
            <p className="text-[#b0b0d0] text-[13px] mb-3 leading-relaxed">
              Subscribe to our newsletter for latest updates and exclusive offers.
            </p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 border-none rounded-l-lg bg-white/10 text-white text-[13px] border border-white/10 focus:outline-none focus:ring-2 focus:ring-mint/50"
              />
              <button className="bg-gradient-to-br from-mint to-purple border-none text-white px-4 rounded-r-lg cursor-pointer font-semibold transition-all text-[13px] hover:bg-gradient-to-br hover:from-purple hover:to-mint">
                <i className="fas fa-paper-plane text-[12px]"></i>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[#b0b0d0] text-[13px] mb-2 font-medium">Download our app</p>
              <div className="flex flex-col gap-2">
                <div className="bg-white/15 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition-all border border-white/10 hover:bg-gradient-to-br hover:from-mint/30 hover:to-purple/30 hover:-translate-y-0.5 hover:border-mint">
                  <i className="fab fa-google-play text-base"></i>
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-80">GET IT ON</span>
                    <span className="text-sm font-bold">Google Play</span>
                  </div>
                </div>
                <div className="bg-white/15 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition-all border border-white/10 hover:bg-gradient-to-br hover:from-mint/30 hover:to-purple/30 hover:-translate-y-0.5 hover:border-mint">
                  <i className="fab fa-apple text-base"></i>
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-80">Download on the</span>
                    <span className="text-sm font-bold">App Store</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/20 text-white transition-all flex items-center justify-center hover:bg-gradient-to-br hover:from-mint hover:to-purple hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(22,194,165,0.3)] border border-white/30"
                  style={{ fontSize: '16px' }}
                >
                  <i className={`fab fa-${social}`} style={{ color: 'white' }}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="/img/logo.png" 
            alt="GatiMitra Logo" 
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center">
            <span className="text-2xl font-black text-[#16c2a5]">Gati</span>
            <span className="text-2xl font-black text-[#ff6b35]">Mitra</span>
          </div>
        </div>
        <div className="text-[#a0a0c0] text-[12px] font-medium text-center">
          © 2025 GatiMitra Technologies Pvt. Ltd. • Moving India Forward
        </div>
        <div className="flex gap-4">
          {['Sitemap', 'Cookie Policy', 'Accessibility'].map((link) => (
            <a key={link} href="#" className="text-[#b0b0d0] no-underline text-[12px] font-medium transition-colors hover:text-mint">
              {link}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          {['VISA', 'MC', 'UPI', 'COD'].map((method) => (
            <div
              key={method}
              className="bg-white/15 w-9 h-6 rounded text-[10px] text-white font-bold flex items-center justify-center transition-all hover:bg-mint hover:-translate-y-0.5"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

