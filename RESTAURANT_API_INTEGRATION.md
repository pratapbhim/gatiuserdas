# Restaurant Pages Integration Guide

## Quick Start

### View the Pages

1. **Restaurant Listing Page**: `/restaurants`
   - Browse all available restaurants
   - Filter by veg/non-veg
   - Sort by rating, delivery time, or name
   - See FSSAI license for each restaurant

2. **Restaurant Detail Page**: `/restaurant/[id]` (e.g., `/restaurant/1`)
   - View specific restaurant details
   - Browse menu with categories
   - See photos, reviews, and info
   - FSSAI license prominently displayed

3. **Navigation**: 
   - Click "All Restaurants" button in header
   - Click any restaurant card to view details
   - Use back button to return

## Dummy Data Structure

### Restaurant Object
```typescript
interface RestaurantData {
  id: string
  name: string                    // e.g., "Bikkhane Biryani"
  cuisines: string[]              // e.g., ["Biryani", "Hyderabadi"]
  address: string                 // Full address
  location: string                // City/Area
  deliveryTime: number            // Minutes
  deliveryFee: number             // ₹ amount
  rating: number                  // 1-5 scale
  reviews: number                 // Total review count
  openingHours: string            // "11:00 AM"
  closingHours: string            // "12:00 AM"
  phone: string                   // "+91..." format
  fssaiLicense: string            // License number (IMPORTANT FOR TRUST)
  image: string                   // URL to main image
  images: string[]                // Array of image URLs
  isOpen: boolean                 // Current status
  discountOffer?: {
    percentage: number
    description: string
  }
}
```

### Menu Item Object
```typescript
interface MenuItem {
  id: string
  name: string                    // e.g., "Veg Dum Biryani"
  description: string             // Item description
  price: number                   // ₹ amount
  image?: string                  // Item image URL
  isVeg: boolean                  // true/false
  category: string                // e.g., "Best in Biryani"
}
```

## API Integration Steps

### Step 1: Update RestaurantPage.tsx

Replace dummy data fetching:

```typescript
// BEFORE (current - using dummy data)
const restaurant: RestaurantData = {
  id: restaurantId || '1',
  name: 'Bikkhane Biryani',
  // ... other dummy data
}

// AFTER (API integration)
const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRestaurant(data)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchRestaurant()
}, [restaurantId])

if (loading) return <LoadingSpinner />
if (!restaurant) return <ErrorPage />
```

### Step 2: Update RestaurantListPage.tsx

Replace dummy restaurant list:

```typescript
// BEFORE
const restaurants: RestaurantCard[] = [
  { id: '1', name: 'Bikkhane Biryani', ... },
  // ... more dummy data
]

// AFTER
const [restaurants, setRestaurants] = useState<RestaurantCard[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRestaurants(data)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchRestaurants()
}, [])

if (loading) return <LoadingSpinner />
```

### Step 3: Create Backend API Route

Create `/app/api/restaurants/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Replace with your database query or external API call
    const restaurants = await fetchRestaurantsFromDB()
    // or
    // const restaurants = await fetch('YOUR_API_ENDPOINT')
    
    return NextResponse.json(restaurants)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
```

Create `/app/api/restaurants/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    // Replace with your database query
    const restaurant = await fetchRestaurantByID(id)
    const menuItems = await fetchMenuItems(id)
    
    return NextResponse.json({
      ...restaurant,
      menuItems
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}
```

### Step 4: Update Menu Items Fetching

In RestaurantPage.tsx, integrate menu data:

```typescript
const [menuItems, setMenuItems] = useState<MenuItem[]>([])

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`)
      if (!res.ok) throw new Error('Failed to fetch menu')
      const data = await res.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }
  
  fetchMenu()
}, [restaurantId])
```

## Database Schema (Example - Supabase/PostgreSQL)

### Restaurants Table
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cuisines TEXT[] NOT NULL,
  address TEXT NOT NULL,
  location VARCHAR(100),
  delivery_time INT,
  delivery_fee INT,
  rating DECIMAL(3,1),
  total_reviews INT,
  opening_hours TIME,
  closing_hours TIME,
  phone VARCHAR(20),
  fssai_license VARCHAR(50) NOT NULL UNIQUE,  -- IMPORTANT FOR TRUST
  image_url TEXT,
  is_open BOOLEAN,
  discount_percentage INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url TEXT,
  is_veg BOOLEAN,
  category VARCHAR(100),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  user_id UUID,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

## Supabase Integration Example

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch all restaurants
export async function fetchRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false })
  
  if (error) throw error
  return data
}

// Fetch specific restaurant
export async function fetchRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Fetch menu items for restaurant
export async function fetchMenuItems(restaurantId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('available', true)
  
  if (error) throw error
  return data
}

// Fetch reviews for restaurant
export async function fetchReviews(restaurantId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
```

## FSSAI License Validation (Important for Trust)

Add validation to ensure FSSAI license is properly formatted:

```typescript
// Utility function to validate FSSAI license
export function isValidFSSAI(license: string): boolean {
  // FSSAI format: 14 digits starting with 10 or 11
  const fssaiRegex = /^(10|11)\d{12}$/
  return fssaiRegex.test(license)
}

// In your API route or form validation:
if (!isValidFSSAI(fssaiLicense)) {
  return NextResponse.json(
    { error: 'Invalid FSSAI license format' },
    { status: 400 }
  )
}
```

## Testing Checklist

- [ ] Restaurant listing page loads without errors
- [ ] Clicking restaurant card navigates to detail page
- [ ] Menu items load and display correctly
- [ ] Veg filter works on both pages
- [ ] FSSAI license displays on all restaurant cards
- [ ] FSSAI license prominently shown on detail page
- [ ] Back navigation works from detail page
- [ ] Mobile responsive design verified
- [ ] Images load correctly
- [ ] Ratings and reviews display properly
- [ ] Sort and filter options work

## Environment Variables Needed

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Or if using different API
NEXT_PUBLIC_API_URL=your_api_url
API_SECRET_KEY=your_secret_key
```

## Performance Optimization Tips

1. **Image Optimization**: Use Next.js Image component (already implemented)
2. **Lazy Loading**: Load menu items on demand
3. **Caching**: Cache restaurant list data with revalidation
4. **Pagination**: Paginate restaurant list if > 20 items
5. **Search**: Implement full-text search for menu items

## Security Considerations

1. **FSSAI License**: Verify license authenticity with FSSAI database
2. **User Reviews**: Implement moderation for user-submitted reviews
3. **Rate Limiting**: Prevent abuse of API endpoints
4. **Input Validation**: Validate all user inputs (filters, searches)
5. **Data Privacy**: Don't expose user phone numbers or emails

## Next Steps

1. Set up database tables
2. Create API endpoints
3. Update components with API calls
4. Test with real data
5. Add loading and error states
6. Implement search and advanced filtering
7. Add image upload capability
8. Integrate with cart system
9. Add order placement flow
10. Implement push notifications for order updates
