import { NextRequest, NextResponse } from "next/server";

// GET - Fetch version history
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;

    // TODO: Fetch revision history from database
    const revisions = [
      {
        id: "rev-1",
        pageId,
        authorId: "user-1",
        author: { name: "Admin User", email: "admin@example.com" },
        changeNote: "Initial version",
        createdAt: new Date("2025-12-20"),
      },
      {
        id: "rev-2",
        pageId,
        authorId: "user-2",
        author: { name: "Editor", email: "editor@example.com" },
        changeNote: "Updated hero section",
        createdAt: new Date("2025-12-24"),
      },
    ];

    return NextResponse.json({
      pageId,
      revisions,
      total: revisions.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch revisions" },
      { status: 500 }
    );
  }
}
