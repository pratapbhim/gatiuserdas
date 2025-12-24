# GatiMitra Restaurant Pages - Design Guide

## Page Layouts

### 1. Restaurant Listing Page (`/restaurants`)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] [Search]    [← Restaurants Near You]    [Cart]  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Restaurants Near You          🥬 Veg Only             │
│  6 restaurants available                                 │
├─────────────────────────────────────────────────────────┤
│  [⭐ Rating] [⚡ Fastest] [A-Z]                          │
└─────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│                  │                  │                  │
│  [Restaurant]    │  [Restaurant]    │  [Restaurant]    │
│   Image/20% OFF  │    Image         │    Image/25% OFF │
│                  │                  │                  │
│  ⭐4.3           │   ⭐4.5          │   ⭐4.4          │
│  Biryani,        │   Biryani,       │   Biryani,       │
│  Hyderabadi      │   Mughlai        │   Mughlai        │
│                  │                  │                  │
│  ✓ FSSAI         │  ✓ FSSAI         │  ✓ FSSAI         │
│  Certified       │  Certified       │  Certified       │
│  10421000001362  │  10421000001450  │  10421000001520  │
│                  │                  │                  │
│  28,500 ratings  │  33,100 ratings  │  42,300 ratings  │
│  34 mins ₹40     │  28 mins ₹30     │  32 mins ₹40     │
└──────────────────┴──────────────────┴──────────────────┘
```

### 2. Restaurant Detail Page (`/restaurant/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]     Restaurant Hero Image       [Share]  [20% OFF] │
│                                                                │
│                 (Full height image with hover zoom)           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                  STICKY HEADER │
│  Bikkhane Biryani          ⭐ 4.3                            │
│  Biryani, Hyderabadi  ✓ FSSAI: 10421000001362              │
│                                 33,100 ratings              │
│                                                              │
│  📍 Kankarbagh, Patna  ⏱ 34 mins  ₹40  🕐 11AM-12AM        │
│                                                              │
│  ADDRESS                    │  CONTACT                      │
│  Shop 2, Plot DS-24/C...   │  📞 +919162140745            │
│                                                              │
│  [Menu] [Photos] [Reviews] [Overview]  ← Tabs              │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┬────────────────────────────────────┐
│ CATEGORIES SIDEBAR   │ MENU ITEMS AREA                    │
│                      │                                    │
│  ☑ All   🥬 Veg      │  ┌──────────────────────────────┐ │
│                      │  │  [Item Image]  Veg Item      │ │
│  ✓ All              │  │  Description text...          │ │
│                      │  │  ₹280  Best in Biryani   [ADD]│ │
│  Veg Item Category   │  └──────────────────────────────┘ │
│  Item Category 2     │                                    │
│  Item Category 3     │  ┌──────────────────────────────┐ │
│  Biryani Sampler     │  │ [Item Image] Non-Veg Item   │ │
│                      │  │ Description...              │ │
│                      │  │ ₹350 Best in Biryani   [ADD] │ │
│                      │  └──────────────────────────────┘ │
│                      │                                    │
│                      │  (More items...)                  │
└──────────────────────┴────────────────────────────────────┘
```

### 3. Photos Tab

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│              │              │              │              │
│   [Image]    │   [Image]    │   [Image]    │   [Image]    │
│              │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│   [Image]    │   [Image]    │   [Image]    │   [Image]    │
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 4. Reviews Tab

```
┌──────────────────────────────────────────────────────┐
│  Rating Summary                                      │
│  ⭐ 4.3 / 5.0                                       │
│  Based on 33,100 ratings                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Customer 1              ⭐⭐⭐⭐⭐   2 weeks ago    │
│  "Great food quality and quick delivery..."         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Customer 2              ⭐⭐⭐⭐⭐   1 week ago     │
│  "Biryani was perfectly cooked and aromatic..."     │
└──────────────────────────────────────────────────────┘
```

### 5. Overview Tab

```
┌─────────────────────────────────────────────────────┐
│  About This Restaurant                              │
│                                                     │
│  ✓ FSSAI Certified                                 │
│    License No: 10421000001362                      │
│                                                     │
│  ⭐ Highly Rated                                   │
│    4.3 rating with 33,100 customer reviews        │
│                                                     │
│  🥬 Fresh & Quality                                │
│    Fresh ingredients & highest hygiene standards   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Cuisines                                           │
│  [Biryani] [Hyderabadi] [Andhra] [Lucknowi]        │
│  [Desserts] [Beverages]                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Operating Hours                                    │
│  ✓ Open Now                                        │
│  11:00 AM - 12:00 AM (Midnight)                   │
└─────────────────────────────────────────────────────┘
```

## Color Scheme

### GatiMitra Branding Colors
```
Primary Teal:     #16c2a5 (Gati branding, primary actions)
Secondary Orange: #ff6b35 (Mitra branding, highlights)
Green Secondary:  #0fa589 (Alternative primary)
Trust Green:      #10B981 (FSSAI certified, veg, trust badges)
Success Green:    #22c55e (Positive states)
```

### Component Colors
```
FSSAI Badge:      Green background (#ecfdf5) with green text (#065f46)
Rating Badge:     Teal gradient (primary colors)
Veg Indicator:    Green square with leaf icon
Non-Veg:          Red square with meat icon
Discount:         Orange gradient
Hover State:      Slight scale-up (105%) with shadow
Active State:     Darker shade with smooth transition
```

## Typography

```
Restaurant Name:       Text-2xl/3xl | Font-bold | Teal hover
Cuisines:             Text-sm | Gray-600 | Truncated
FSSAI License:        Text-xs | Green-700 | Bold | Badge
Rating/Reviews:       Text-sm | Font-bold
Delivery Info:        Text-[11px] | Font-semibold
Menu Item Name:       Text-sm | Font-bold | Dark
Menu Item Price:      Text-[12px] | Orange | Font-bold
Menu Item Category:   Text-[10px] | Gray-500
```

## Responsive Design

### Mobile (< 640px)
- Single column layout for restaurants
- Full-width hero image (h-40)
- Categories sidebar hidden, integrated into search
- Reduced padding and font sizes
- Mobile menu for navigation

### Tablet (640px - 1024px)
- Two column grid for restaurants
- Medium hero image (h-48)
- Touch-friendly button sizes
- Visible category sidebar in restaurant detail

### Desktop (1024px+)
- Three column grid for restaurants
- Full height hero image (h-96)
- Side-by-side layout with categories
- All features visible
- Hover effects enabled

## Interactive Elements

### Hover States
- Restaurant cards: Scale up (102%), shadow increase
- Menu items: Add to cart button scales (105%)
- Images: Subtle zoom (110%)
- Links: Color transition with underline

### Animations
- Page transitions: Smooth fade-in
- Image hover: 500ms scale transformation
- Button hover: 300ms scale and shadow change
- Tab switches: Instant with smooth border animation

## Trust-Building Elements

1. **FSSAI License Display**: 
   - Prominent green badge with checkmark
   - License number visible
   - On all restaurant cards and detail page

2. **Rating System**:
   - Star ratings prominently displayed
   - Review count shown
   - Detailed customer reviews

3. **Operating Hours**:
   - Clear "Open Now" indicator
   - Full hours displayed
   - Real-time status

4. **Contact Information**:
   - Direct phone link
   - Full address
   - Delivery time transparency

## Future Enhancements

1. **Map Integration**: Show restaurant location on map
2. **Online Ordering Status**: Real-time order tracking
3. **Customer Photos**: User-uploaded restaurant photos
4. **Menu Search**: Full-text search across menu items
5. **Dietary Filters**: Allergies, dietary restrictions
6. **Social Features**: Save favorites, share with friends
7. **Promotions**: Dynamic coupon display
8. **Analytics**: Track popular items, peak hours
