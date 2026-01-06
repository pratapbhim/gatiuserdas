import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // TODO: Fetch media from database with pagination
    const media = [
      {
        id: "media-1",
        url: "/img/hero.jpg",
        fileName: "hero.jpg",
        mimeType: "image/jpeg",
        size: 256000,
        width: 1920,
        height: 1080,
        altText: "Hero banner",
        createdAt: new Date(),
      },
    ];

    return NextResponse.json({
      data: media,
      pagination: {
        page,
        limit,
        total: media.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST - Upload media
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // TODO: Implement file upload
    // 1. Validate file type and size
    // 2. Upload to storage (S3, etc)
    // 3. Save metadata to database

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        fileName: file.name,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
