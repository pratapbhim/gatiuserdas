'use client'

import { useState } from 'react'

export default function BrandSections() {
  const [foodPage, setFoodPage] = useState(0)
  const perPage = 14

  const foodBrands = [
    "https://upload.wikimedia.org/wikipedia/commons/3/3b/Taco_Bell_Logo_2016.svg",
    "https://danachoga.com/wp-content/uploads/2022/05/danachoga-logo.png",
    "https://sevenntenders.com/assets/images/logo.png",
    "https://www.chaayos.com/images/logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1f/Wow_Momo_logo.png",
    "https://upload.wikimedia.org/wikipedia/en/6/6b/BTW_logo.png",
    "https://samosaparty.com/wp-content/uploads/2022/02/logo.png",
    "https://freshmenu.com/images/logo.svg",
    "https://eatfit.in/static/images/logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3b/Wendy%27s_logo_2012.svg",
    "https://biryani-by-kilo.s3.ap-south-1.amazonaws.com/logo.png",
    "https://behrouzbiryani.com/assets/images/logo.png",
    "https://omfoods.in/logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg"
  ]

  const fashionBrands = [
    "https://upload.wikimedia.org/wikipedia/commons/7/7e/Bata_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_logo.svg",
    "https://upload.wikimedia.org/wikipedia/en/3/35/Spykar_Logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Lifestyle_Stores_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/en/1/18/Shoppers_Stop_Logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/9/97/Trends_Footwear_logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Pepe_Jeans_logo.svg",
  ]

  const onlineBrands = [
    "https://upload.wikimedia.org/wikipedia/commons/4/4a/Nykaa_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/8b/MakeMyTrip_Logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/12/Mamaearth_logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Bombay_Shaving_Company_logo.png",
  ]

  const renderBrandGrid = (brands: string[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 max-w-[1200px] mx-auto my-12">
      {brands.map((src, index) => (
        <div
          key={index}
          className="bg-white h-[170px] rounded-[32px] border-2 border-border flex items-center justify-center cursor-pointer transition-all duration-[400ms] relative overflow-hidden group hover:-translate-y-3 hover:scale-105 hover:shadow-[0_35px_70px_rgba(75,42,212,0.25)] hover:border-mint"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-mint/10 to-purple/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <img
            src={src}
            alt={`Brand ${index + 1}`}
            className="max-w-[95px] max-h-[65px] object-contain relative z-10"
          />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Food Brands */}
      <section className="py-24 px-5 md:px-20 relative">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-mint">Food Delivery</span> <span className="text-purple">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-mint to-purple rounded"></span>
        </h1>
        <div id="foodGrid" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 max-w-[1200px] mx-auto my-12">
          {foodBrands.slice(foodPage * perPage, foodPage * perPage + perPage).map((src, index) => (
            <div
              key={index}
              className="bg-white h-[170px] rounded-[32px] border-2 border-border flex items-center justify-center cursor-pointer transition-all duration-[400ms] relative overflow-hidden group hover:-translate-y-3 hover:scale-105 hover:shadow-[0_35px_70px_rgba(75,42,212,0.25)] hover:border-mint"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-mint/10 to-purple/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <img
                src={src}
                alt={`Food Brand ${index + 1}`}
                className="max-w-[95px] max-h-[65px] object-contain relative z-10"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-5 mt-10">
          <button
            onClick={() => setFoodPage(p => Math.max(0, p - 1))}
            disabled={foodPage === 0}
            className="bg-white border-2 border-mint text-mint px-8 py-3.5 rounded-[30px] font-bold cursor-pointer transition-all text-[15px] relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none hover:bg-gradient-to-br hover:from-mint hover:to-purple hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,194,165,0.3)]"
          >
            ← Previous
          </button>
          <button
            onClick={() => setFoodPage(p => p + 1)}
            disabled={(foodPage + 1) * perPage >= foodBrands.length}
            className="bg-white border-2 border-mint text-mint px-8 py-3.5 rounded-[30px] font-bold cursor-pointer transition-all text-[15px] relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none hover:bg-gradient-to-br hover:from-mint hover:to-purple hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,194,165,0.3)]"
          >
            Next →
          </button>
        </div>
      </section>

      {/* Fashion Brands */}
      <section className="py-24 px-5 md:px-20 relative">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-mint">Fashion</span> <span className="text-purple">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-mint to-purple rounded"></span>
        </h1>
        {renderBrandGrid(fashionBrands)}
      </section>

      {/* Online Brands */}
      <section className="py-24 px-5 md:px-20 relative">
        <h1 className="text-center text-[42px] font-black mb-[60px] relative">
          Top <span className="text-mint">Online</span> <span className="text-purple">Brands</span>
          <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-mint to-purple rounded"></span>
        </h1>
        {renderBrandGrid(onlineBrands)}
      </section>
    </>
  )
}

