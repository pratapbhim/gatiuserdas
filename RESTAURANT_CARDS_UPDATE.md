# Restaurant Cards Update - Compact Layout & Navigation

## Changes Made

### 1. Added "Back to Home" Button
**File**: `components/order/RestaurantsSection.tsx`

**Changes**:
- Added Home navigation link in the breadcrumb at the top of the page
- When viewing filtered restaurants (by category), shows: `Home / All / Category`
- When viewing all restaurants, shows: `Home`
- Uses consistent teal color (#16c2a5) to match existing design
- Home icon for visual clarity

**Code Structure**:
```tsx
<div className="flex items-center gap-2 mb-2">
  {selectedCategory && (
    <>
      <Link href="/" className="...Home...">
        <i className="fas fa-home"></i>
        Home
      </Link>
      <span className="text-gray-400">/</span>
      <Link href="/restaurants" className="...All...">
        <i className="fas fa-arrow-left"></i>
        All
      </Link>
    </>
  )}
  {!selectedCategory && (
    <Link href="/" className="...Home...">
      <i className="fas fa-home"></i>
      Home
    </Link>
  )}
</div>
```

### 2. Reduced Card Sizes for Compact Layout

**Grid Gap**:
- Changed from `gap-7` to `gap-5`
- More compact spacing between cards

**Card Border Radius**:
- Changed from `rounded-3xl` to `rounded-2xl`
- Slightly less rounded corners for compact appearance

**Card Hover Effect**:
- Changed from `hover:-translate-y-4` to `hover:-translate-y-2`
- Subtle lift on hover instead of dramatic movement

**Image Section Height**:
- Changed from `h-56` to `h-44`
- Reduced by approximately 21% for more compact card

**Badge Padding & Spacing**:

| Element | Before | After |
|---------|--------|-------|
| Top badge area padding | `pt-4 px-4` | `pt-3 px-3` |
| Veg badge padding | `px-3 py-1.5` | `px-2.5 py-1` |
| Veg badge circle | `w-2.5 h-2.5` | `w-2 h-2` |
| Discount badge padding | `px-3 py-1.5` | `px-2.5 py-1` |
| Discount badge gap | `gap-1` | `gap-0.5` |
| Rating badge section height | `h-12` | `h-10` |
| Rating badge padding | `p-3` | `p-2` |
| Rating badge padding | `px-3 py-1.5` | `px-2.5 py-1` |

**Content Section**:

| Element | Before | After |
|---------|--------|-------|
| Content padding | `p-5` | `p-4` |
| Header margin | `mb-4` | `mb-3` |
| Title font size | `text-base` | `text-sm` |
| Title margin | `mb-2` | `mb-1` |
| Reviews margin | `mb-4 pb-4` | `mb-3 pb-3` |
| FSSAI border radius | `rounded-2xl` | `rounded-xl` |
| FSSAI padding | `p-3` | `p-2` |
| FSSAI margin | `mb-4` | `mb-3` |
| Delivery info padding | `pt-4` | `pt-3` |
| Delivery info gap | `gap-3` | `gap-2` |
| Delivery icon sizes | `w-8 h-8` | `w-7 h-7` |
| Delivery info icon gap | `gap-2` | `gap-1.5` |

## Visual Impact

### Before Changes
- Larger cards with 7px gaps
- Taller image sections (h-56)
- More rounded corners (rounded-3xl)
- Pronounced hover effect (-translate-y-4)
- Larger badges and more padding

### After Changes
- Compact cards with 5px gaps
- Shorter image sections (h-44, ~21% reduction)
- Slightly rounded corners (rounded-2xl)
- Subtle hover effect (-translate-y-2)
- Smaller badges with optimized padding
- Cleaner, more balanced appearance

## Responsive Breakpoints
The layout remains responsive across all breakpoints:
- **Mobile**: `grid-cols-1`
- **Tablet**: `sm:grid-cols-2`
- **Large**: `lg:grid-cols-3`
- **XL**: `xl:grid-cols-4`

## Navigation Hierarchy
New breadcrumb navigation provides:
1. **Clear Path**: Home → All Restaurants → Category
2. **Easy Navigation**: Quick links to go back
3. **Visual Consistency**: Matches existing design system
4. **Mobile Friendly**: Responsive link sizes

## Build Status
✅ TypeScript compilation: Successful
✅ Dev server: Running without errors
✅ All routes: Functional

## Files Modified
- `components/order/RestaurantsSection.tsx` - 13 replacements
  - Added Home navigation
  - Reduced gap from 7 to 5
  - Reduced border-radius
  - Reduced image height (h-56 → h-44)
  - Reduced hover effect (translate-y-4 → translate-y-2)
  - Reduced all badge and content padding
  - Reduced icon sizes in delivery section
