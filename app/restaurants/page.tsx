import { Suspense } from 'react'
import RestaurantListPage from '@/components/restaurant/RestaurantListPage'

export const metadata = {
  title: 'Restaurants | GatiMitra Food',
  description: 'Browse all restaurants available on GatiMitra',
}

function RestaurantsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading restaurants...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<RestaurantsLoading />}>
      <RestaurantListPage />
    </Suspense>
  )
}
