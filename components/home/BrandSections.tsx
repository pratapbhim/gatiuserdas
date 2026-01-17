'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 404 Component for brand details not found
const BrandNotFound404 = () => {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left side - Image with increased height */}
        <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/img/wrong.png"
            alt="Wrong turn illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Right side - Content with reduced text area */}
        <div className="text-center md:text-left space-y-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Oops,
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Brand Not Found!
            </h1>
            <div className="text-8xl md:text-9xl font-black text-gray-900 opacity-10 -mt-6 -mb-4">
              404
            </div>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Looks like we couldn't find details for this brand!
            Let's take you back to discover more amazing brands and stores.
          </p>
          
          <div className="space-y-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              <span>Back to Brands</span>
              <i className="fas fa-home text-xl"></i>
            </button>
            
            <p className="text-gray-500 text-sm italic">
              Discover top brands across food, fashion, and online stores
            </p>
          </div>
          
          {/* Additional decorative elements */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-utensils text-green-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Food Brands</span>
                  <span className="text-xs text-gray-500">Delivery & Restaurants</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-tshirt text-blue-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Fashion Brands</span>
                  <span className="text-xs text-gray-500">Clothing & Accessories</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
                  <i className="fas fa-shopping-bag text-purple-600 text-lg"></i>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Online Brands</span>
                  <span className="text-xs text-gray-500">E-commerce & Services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrandSections() {
  const router = useRouter()
  const [foodPage, setFoodPage] = useState(0)
  const [show404, setShow404] = useState(false)
  const [loadingBrand, setLoadingBrand] = useState(false)
  const perPage = 14

  const foodBrands = [
    { id: "taco-bell", name: "Taco Bell", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Taco_Bell_Logo_2016.svg", available: true },
    { id: "danachoga", name: "Danachoga", logo: "https://danachoga.com/wp-content/uploads/2022/05/danachoga-logo.png", available: true },
    { id: "sevenntenders", name: "Sevenntenders", logo: "https://sevenntenders.com/assets/images/logo.png", available: true },
    { id: "chaayos", name: "Chaayos", logo: "https://www.chaayos.com/images/logo.png", available: true },
    { id: "pizza-hut", name: "Pizza Hut", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg", available: true },
    { id: "wow-momo", name: "Wow Momo", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Wow_Momo_logo.png", available: true },
    { id: "btw", name: "BTW", logo: "https://upload.wikimedia.org/wikipedia/en/6/6b/BTW_logo.png", available: true },
    { id: "samosaparty", name: "Samosa Party", logo: "https://samosaparty.com/wp-content/uploads/2022/02/logo.png", available: true },
    { id: "freshmenu", name: "FreshMenu", logo: "https://freshmenu.com/images/logo.svg", available: true },
    { id: "eatfit", name: "EatFit", logo: "https://eatfit.in/static/images/logo.svg", available: true },
    { id: "wendys", name: "Wendy's", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Wendy%27s_logo_2012.svg", available: true },
    { id: "biryani-by-kilo", name: "Biryani By Kilo", logo: "https://biryani-by-kilo.s3.ap-south-1.amazonaws.com/logo.png", available: true },
    { id: "behrouzbiryani", name: "Behrouz Biryani", logo: "https://behrouzbiryani.com/assets/images/logo.png", available: true },
    { id: "omfoods", name: "OM Foods", logo: "https://omfoods.in/logo.png", available: true },
    { id: "subway", name: "Subway", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg", available: true }
  ]

  const fashionBrands = [
    { id: "bata", name: "Bata", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Bata_Logo.svg", available: true },
    { id: "puma", name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_logo.svg", available: true },
    { id: "spykar", name: "Spykar", logo: "https://upload.wikimedia.org/wikipedia/en/3/35/Spykar_Logo.png", available: true },
    { id: "lifestyle", name: "Lifestyle Stores", logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Lifestyle_Stores_Logo.svg", available: true },
    { id: "shoppers-stop", name: "Shoppers Stop", logo: "https://upload.wikimedia.org/wikipedia/en/1/18/Shoppers_Stop_Logo.png", available: true },
    { id: "trends-footwear", name: "Trends Footwear", logo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Trends_Footwear_logo.png", available: true },
    { id: "pepe-jeans", name: "Pepe Jeans", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Pepe_Jeans_logo.svg", available: true }
  ]

  const onlineBrands = [
    { id: "nykaa", name: "Nykaa", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Nykaa_Logo.svg", available: true },
    { id: "myntra", name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.png", available: true },
    { id: "amazon", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", available: true },
    { id: "uber", name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", available: true },
    { id: "makemytrip", name: "MakeMyTrip", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/MakeMyTrip_Logo.png", available: true },
    { id: "mamaearth", name: "Mamaearth", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Mamaearth_logo.png", available: true },
    { id: "bombay-shaving", name: "Bombay Shaving Company", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Bombay_Shaving_Company_logo.png", available: true }
  ]

  // Function to handle brand click
  const handleBrandClick = (brand: { id: string; name: string; available: boolean }) => {
    setLoadingBrand(true)
    
    // Simulate API call to check if brand details are available
    setTimeout(() => {
      setLoadingBrand(false)
      
      if (!brand.available) {
        // If brand details are not available, show 404
        setShow404(true)
      } else {
        // If available, navigate to brand details page
        router.push(`/brand/${brand.id}`)
      }
    }, 500)
  }

  // Function to render brand grid
  const renderBrandGrid = (brands: { id: string; name: string; logo: string; available: boolean }[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 max-w-[1200px] mx-auto my-12">
      {brands.map((brand, index) => (
        <button
          key={brand.id}
          onClick={() => handleBrandClick(brand)}
          className="bg-white h-[170px] rounded-[32px] border-2 border-border flex items-center justify-center cursor-pointer transition-all duration-[400ms] relative overflow-hidden group hover:-translate-y-3 hover:scale-105 hover:shadow-[0_35px_70px_rgba(75,42,212,0.25)] hover:border-mint focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2"
          disabled={loadingBrand}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-mint/10 to-purple/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          
          {/* Loading spinner */}
          {loadingBrand && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
              <div className="w-8 h-8 border-3 border-mint border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Brand logo */}
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-w-[95px] max-h-[65px] object-contain relative z-10"
          />
          
          {/* Hover info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <p className="text-xs font-bold truncate">{brand.name}</p>
            <p className="text-[10px] opacity-90">Click to explore</p>
          </div>
          
          {/* Availability badge */}
          {!brand.available && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold z-10">
              Soon
            </div>
          )}
        </button>
      ))}
    </div>
  )

  // Show 404 page if brand details not found
  if (show404) {
    return <BrandNotFound404 />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Food Brands */}
      <section className="py-24 px-5 md:px-20 relative">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-mint">Food Delivery</span> <span className="text-purple">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-mint to-purple rounded"></span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover the best food delivery and restaurant brands. Click on any brand to explore their menu and place orders.
        </p>
        
        <div id="foodGrid">
          {renderBrandGrid(foodBrands.slice(foodPage * perPage, foodPage * perPage + perPage))}
        </div>
        
        <div className="flex justify-center gap-5 mt-10">
          <button
            onClick={() => setFoodPage(p => Math.max(0, p - 1))}
            disabled={foodPage === 0}
            className="bg-white border-2 border-mint text-mint px-8 py-3.5 rounded-[30px] font-bold cursor-pointer transition-all text-[15px] relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none hover:bg-gradient-to-br hover:from-mint hover:to-purple hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,194,165,0.3)] focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2"
          >
            ← Previous
          </button>
          <button
            onClick={() => setFoodPage(p => p + 1)}
            disabled={(foodPage + 1) * perPage >= foodBrands.length}
            className="bg-white border-2 border-mint text-mint px-8 py-3.5 rounded-[30px] font-bold cursor-pointer transition-all text-[15px] relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none hover:bg-gradient-to-br hover:from-mint hover:to-purple hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,194,165,0.3)] focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2"
          >
            Next →
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Page {foodPage + 1} of {Math.ceil(foodBrands.length / perPage)}
          </p>
        </div>
      </section>

      {/* Fashion Brands */}
      <section className="py-24 px-5 md:px-20 relative bg-white">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-purple">Fashion</span> <span className="text-pink-500">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-purple to-pink-500 rounded"></span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Explore leading fashion brands for clothing, footwear, and accessories. Click to shop now.
        </p>
        {renderBrandGrid(fashionBrands)}
      </section>

      {/* Online Brands */}
      <section className="py-24 px-5 md:px-20 relative">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-blue-500">Online</span> <span className="text-cyan-500">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover top e-commerce and service brands. Click to explore their products and services.
        </p>
        {renderBrandGrid(onlineBrands)}
      </section>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        /* Define color variables if not already defined */
        :root {
          --mint: #16c2a5;
          --purple: #4b2ad4;
          --border: #e5e7eb;
        }
        
        .text-mint {
          color: var(--mint);
        }
        
        .text-purple {
          color: var(--purple);
        }
        
        .border-mint {
          border-color: var(--mint);
        }
        
        .border-border {
          border-color: var(--border);
        }
        
        .bg-mint {
          background-color: var(--mint);
        }
        
        .bg-purple {
          background-color: var(--purple);
        }
        
        .from-mint {
          --tw-gradient-from: var(--mint);
        }
        
        .to-purple {
          --tw-gradient-to: var(--purple);
        }
      `}</style>
    </div>
  )
}