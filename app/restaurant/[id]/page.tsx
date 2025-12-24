import RestaurantPage from '@/components/restaurant/RestaurantPage'

export const metadata = {
  title: 'Restaurant Details | GatiMitra Food',
  description: 'View restaurant details, menu, ratings and order online',
}

export default function Page({ params }: { params: { id: string } }) {
  return <RestaurantPage restaurantId={params.id} />
}
