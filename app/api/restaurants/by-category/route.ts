import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/restaurants/by-category?category=Biryani
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    if (!category) {
      return NextResponse.json({ error: 'Missing category parameter' }, { status: 400 })
    }

    // 1. Get all menu_items with matching category_item
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('restaurant_id')
      .eq('category_item', category)
      .eq('is_active', true)

    if (menuError) {
      return NextResponse.json({ error: 'Failed to fetch menu items', details: menuError.message }, { status: 500 })
    }

    // 2. Get unique restaurant_ids
    const restaurantIds = [...new Set((menuItems || []).map((item: any) => item.restaurant_id))].filter(Boolean)
    if (restaurantIds.length === 0) {
      return NextResponse.json([])
    }

    // 3. Fetch restaurants with those ids
    const { data: restaurants, error: restError } = await supabase
      .from('restaurants')
      .select('*')
      .in('restaurant_id', restaurantIds)

    if (restError) {
      return NextResponse.json({ error: 'Failed to fetch restaurants', details: restError.message }, { status: 500 })
    }

    return NextResponse.json(restaurants || [])
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
