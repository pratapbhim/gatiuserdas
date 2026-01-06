import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all data of a specific type
export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const filters = Object.fromEntries(url.searchParams.entries());

    let query = supabase.from(type).select('*');

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (key !== 'limit' && key !== 'offset') {
        query = query.eq(key, value);
      }
    }

    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: { offset, limit, total: count }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST - Create new record
export async function POST(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    const body = await request.json();

    const { data, error } = await supabase
      .from(type)
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

// PUT - Update record
export async function PUT(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from(type)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE - Delete record
export async function DELETE(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    const { id } = await request.json();

    const { error } = await supabase
      .from(type)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
