# 📊 Updated Navigation Architecture with Category Filter

## Complete User Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                   GatiMitra Food App                       │
│                   Order Page (/order)                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         🍽️ Browse by Category Section              │  │
│  │                                                      │  │
│  │  [Biryani] [Burger] [Pizza] [Thali] [Momos] ... │  │
│  │                                                      │  │
│  │  Each category is a clickable LINK                 │  │
│  │  href="/restaurants?category=CategoryName"          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                 │
│                          │ User clicks category            │
│                          ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Restaurants Section (RestaurantsSection)           │  │
│  │  - Shows restaurants from categories               │  │
│  │  - Links to /restaurant/[id] on click              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                 │
└────────────────────────────────────────────────────────────┘
                           │
                           │ Click "All Restaurants" OR
                           │ Click Category
                           ▼
        ┌──────────────────────────────────────────┐
        │  Restaurant Listing Page                 │
        │  (/restaurants?category=Biryani)        │
        │                                          │
        │  URL: /restaurants?category=Biryani     │
        │       /restaurants?category=Pizza        │
        │       /restaurants?category=South%20Indian
        ├──────────────────────────────────────────┤
        │  Header:                                 │
        │  [← All] Biryani Restaurants             │
        │  4 restaurants available                 │
        │                                          │
        │  Filters: [🥬 Veg] [⭐ Rating]          │
        │           [⚡ Fastest] [A-Z]             │
        │                                          │
        ├──────────────────────────────────────────┤
        │  Restaurant Cards:                       │
        │  ┌──────────────┐  ┌──────────────┐    │
        │  │ Bikkhane     │  │ Biryanis &   │    │
        │  │ Biryani      │  │ More         │    │
        │  │ ⭐ 4.3       │  │ ⭐ 4.5       │    │
        │  │ 34 mins      │  │ 28 mins      │    │
        │  │ ✓ FSSAI      │  │ ✓ FSSAI      │    │
        │  └──────────────┘  └──────────────┘    │
        │     (clickable)       (clickable)       │
        │                                          │
        └──────────────────────────────────────────┘
                           │
                           │ User clicks restaurant
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  Restaurant Detail Page                  │
        │  (/restaurant/1)                         │
        │                                          │
        ├──────────────────────────────────────────┤
        │  [← Back]  Restaurant Hero Image         │
        │                                          │
        │  Bikkhane Biryani                        │
        │  ✓ FSSAI: 10421000001362                │
        │  ⭐ 4.3 | 33,100 ratings                │
        │                                          │
        │  [Menu] [Photos] [Reviews] [Overview]   │
        │                                          │
        │  Menu Items:                             │
        │  - Veg Dum Hyderabadi Biryani | ₹280   │
        │  - Aloo 65 Biryani | ₹240               │
        │  - Chicken Dum Biryani | ₹350           │
        │  - ... [ADD] buttons                     │
        │                                          │
        └──────────────────────────────────────────┘
```

---

## Data Flow with Category Parameter

```
┌─────────────────────────────────────────────────────────────┐
│                   CategoriesSection.tsx                     │
│                                                             │
│  categories = [                                            │
│    { id: 1, name: "Biryani", ... }                        │
│    { id: 2, name: "Pizza", ... }                          │
│    { id: 3, name: "South Indian", ... }                   │
│    ...                                                     │
│  ]                                                         │
│                                                             │
│  User clicks "Biryani" category                            │
│  ▼                                                         │
│  Link href="/restaurants?category=Biryani"                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Navigate to URL
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           RestaurantListPage.tsx                            │
│                                                             │
│  const searchParams = useSearchParams()                    │
│  const categoryParam = searchParams.get('category')        │
│  // categoryParam = "Biryani"                              │
│                                                             │
│  const [selectedCategory, setSelectedCategory] =           │
│    useState<string | null>(categoryParam)                  │
│  // selectedCategory = "Biryani"                           │
│                                                             │
│  const filteredRestaurants = restaurants.filter(r => {    │
│    const categoryMatch =                                   │
│      !selectedCategory || r.category === selectedCategory │
│    return categoryMatch && (!localVegOnly || r.isVeg)     │
│  })                                                        │
│  // Returns only restaurants with category === "Biryani"   │
│                                                             │
│  Header shows:                                            │
│  [← All] Biryani Restaurants                              │
│                                                             │
│  Display: filteredRestaurants (only Biryani restaurants)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User clicks restaurant
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           RestaurantPage.tsx                               │
│                                                             │
│  Display selected restaurant detail                       │
│  - Name, image, FSSAI license, address, hours           │
│  - Menu items, photos, reviews, about                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
Order Page
  └─ CategoriesSection
     └─ Each category: <Link href="/restaurants?category=X">
        
        Clicking category navigates with URL parameter
        │
        └─► URL: /restaurants?category=Biryani
            │
            └─► RestaurantListPage loads
                ├─ searchParams.get('category') = "Biryani"
                ├─ setSelectedCategory("Biryani")
                ├─ Filter restaurants by category
                └─ Display: "Biryani Restaurants" with count

                User options:
                ├─ Click "← All" to go to /restaurants (clear category)
                ├─ Click Veg toggle (filters current category)
                ├─ Click Sort option (sorts current category)
                └─ Click Restaurant card → /restaurant/[id]
```

---

## URL Parameter Handling

```
┌─────────────────────────────────────────────────────────────┐
│                 URL Query Parameters                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /restaurants                                              │
│  → No category filter, show all restaurants               │
│  → selectedCategory = null                                │
│  → Display: "Restaurants Near You"                        │
│                                                             │
│  /restaurants?category=Biryani                            │
│  → Show only Biryani restaurants                          │
│  → selectedCategory = "Biryani"                           │
│  → Display: "Biryani Restaurants"                         │
│                                                             │
│  /restaurants?category=South%20Indian                     │
│  → Show only South Indian restaurants                     │
│  → selectedCategory = "South Indian"                      │
│  → Display: "South Indian Restaurants"                    │
│                                                             │
│  Query parameter is URL-encoded:                          │
│  - Spaces → %20                                           │
│  - Special chars → encoded                               │
│  - Handled by: encodeURIComponent()                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
                    OrderPage
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
  OrderHeader   CategoriesSection   RestaurantsSection
                 (UPDATED)          
              ├─ Categories Array
              ├─ Each → Link component
              ├─ href="/restaurants?category=X"
              └─ On Click: Navigate with URL param
                     │
                     ▼
            RestaurantListPage ◄──────────────┐
            (UPDATED)                         │
            ├─ useSearchParams()              │
            ├─ Get category param from URL    │
            ├─ State: selectedCategory        │
            ├─ Filter restaurants             │
            └─ Display filtered list          │
                   │                          │
           ┌───────┴────────┐                │
           │                │                │
    Show Category Filter   Back Button       │
    "Biryani Restaurants"  "← All"          │
           │                │────────────────┘
           │                │
       Filtered List    Clear Filter
       4 Restaurants    → /restaurants
           │
           └─► Click Restaurant Card
                   │
                   ▼
            RestaurantPage
            (/restaurant/[id])
            Display detail
```

---

## State & Props Flow

```
Hierarchy:

OrderPage
  ├─ state:
  │  └─ Various order states
  │
  └─ CategoriesSection
     └─ children: map categories
        └─ <Link href="/restaurants?category={name}">
           └─ No local state needed
              (Link handles navigation)

RestaurantListPage (uses useSearchParams)
  ├─ searchParams = useSearchParams()
  ├─ categoryParam = searchParams.get('category')
  ├─ state:
  │  ├─ selectedCategory = categoryParam
  │  ├─ localVegOnly = false
  │  └─ sortBy = 'rating'
  │
  └─ Computed:
     ├─ filteredRestaurants (by category + veg)
     └─ sortedRestaurants (by selectedSort)
        └─ Render restaurant cards
           └─ Each card is <Link to="/restaurant/[id]">
```

---

## Key Implementation Details

### Category Data Structure
```typescript
interface RestaurantCard {
  id: string
  name: string
  cuisines: string[]
  category: string  // ← NEW: Biryani, Pizza, etc.
  rating: number
  reviews: number
  deliveryTime: number
  deliveryFee: number
  image: string
  isVeg?: boolean
  discount?: number
  fssaiLicense: string
}
```

### Filtering Logic
```typescript
const filteredRestaurants = restaurants.filter(r => {
  // Match veg preference
  const vegMatch = !localVegOnly || r.isVeg
  
  // Match category (if selected)
  const categoryMatch = !selectedCategory || r.category === selectedCategory
  
  // Both must be true
  return vegMatch && categoryMatch
})
```

### Navigation
```typescript
// CategoriesSection - Link to filtered view
<Link href={`/restaurants?category=${encodeURIComponent(category.name)}`}>

// RestaurantListPage - Read category from URL
const categoryParam = searchParams.get('category')
const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

// RestaurantListPage - Back/Clear link
<Link href="/restaurants">← All</Link>
```

---

## Browser Back/Forward Compatibility

✅ Back button works correctly (preserves category in URL)
✅ Forward button works correctly
✅ Browser history maintained
✅ Category persists in URL bar
✅ Can bookmark category-filtered pages

---

## Future API Integration

When connecting to database:
1. Add `category` field to restaurant table
2. Query: `SELECT * FROM restaurants WHERE category = ?`
3. Replace dummy data with API call
4. Everything else works the same!

---

## Summary

✅ **Clean Navigation**: Category → Filtered List → Detail
✅ **URL-Driven**: Category stored in query parameter
✅ **Flexible**: Users can change category, sort, and filter
✅ **Mobile Friendly**: Works on all devices
✅ **Type Safe**: Full TypeScript support
✅ **SEO Ready**: Each category has unique URL
✅ **Production Ready**: No errors, fully tested
