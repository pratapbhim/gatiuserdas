import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/search?q=burger
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    if (!q) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 })
    }

    // 1. Search menu_items for item_name/category/category_item match (case-insensitive, partial)
    // 2. Score: exact match > starts with > includes > fuzzy (Levenshtein)
    // 3. Return: item_name, category, category_item, restaurant_id, score
    // 4. Limit results for performance

    // Use ilike for partial match, but also compute a score
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('id, item_name, category, category_item, restaurant_id, price, image_url')
      .or(`item_name.ilike.%${q}%,category.ilike.%${q}%,category_item.ilike.%${q}%`)
      .eq('is_active', true)
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'Failed to search menu items', details: error.message }, { status: 500 })
    }

    // Score: exact match = 100, starts with = 80, includes = 60, else 40
    function getScore(item) {
      const qLower = q.toLowerCase()
      let score = 0
      if (item.item_name.toLowerCase() === qLower || item.category.toLowerCase() === qLower || (item.category_item||'').toLowerCase() === qLower) score = 100
      else if (item.item_name.toLowerCase().startsWith(qLower) || item.category.toLowerCase().startsWith(qLower) || (item.category_item||'').toLowerCase().startsWith(qLower)) score = 80
      else if (item.item_name.toLowerCase().includes(qLower) || item.category.toLowerCase().includes(qLower) || (item.category_item||'').toLowerCase().includes(qLower)) score = 60
      else score = 40
      return score
    }

    const results = (items || [])
      .map(item => ({ ...item, score: getScore(item) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)

    return NextResponse.json(results)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
