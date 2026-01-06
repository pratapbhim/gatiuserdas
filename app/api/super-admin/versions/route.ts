import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Save version
export async function POST(request: NextRequest) {
  try {
    const {
      section,
      data,
      changeDescription,
      editorId,
      editorName
    } = await request.json();

    const versionData = {
      section,
      data,
      change_description: changeDescription,
      editor_id: editorId,
      editor_name: editorName,
      created_at: new Date().toISOString(),
      is_active: true
    };

    const { data: savedVersion, error } = await supabase
      .from('version_history')
      .insert([versionData])
      .select();

    if (error) throw error;

    return NextResponse.json(savedVersion[0], { status: 201 });
  } catch (error) {
    console.error('Save version error:', error);
    return NextResponse.json({ error: 'Failed to save version' }, { status: 500 });
  }
}

// GET - Fetch versions for a section
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const section = url.searchParams.get('section');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let query = supabase
      .from('version_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      versions: data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Fetch versions error:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}

// PUT - Restore version
export async function PUT(request: NextRequest) {
  try {
    const { versionId, section } = await request.json();

    // Get the version to restore
    const { data: versionData, error: fetchError } = await supabase
      .from('version_history')
      .select('*')
      .eq('id', versionId)
      .single();

    if (fetchError) throw fetchError;

    // Deactivate current version
    await supabase
      .from('version_history')
      .update({ is_active: false })
      .eq('section', section)
      .eq('is_active', true);

    // Activate restored version
    const { data: restoredVersion, error: updateError } = await supabase
      .from('version_history')
      .update({ 
        is_active: true,
        restored_at: new Date().toISOString()
      })
      .eq('id', versionId)
      .select();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      restoredVersion: restoredVersion[0]
    });
  } catch (error) {
    console.error('Restore version error:', error);
    return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 });
  }
}

// DELETE - Delete version
export async function DELETE(request: NextRequest) {
  try {
    const { versionId } = await request.json();

    const { error } = await supabase
      .from('version_history')
      .delete()
      .eq('id', versionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete version error:', error);
    return NextResponse.json({ error: 'Failed to delete version' }, { status: 500 });
  }
}
