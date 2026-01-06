import { NextRequest, NextResponse } from "next/server";

// DELETE - Delete media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const mediaId = params.mediaId;

    // TODO: Delete from storage and database

    return NextResponse.json({
      message: "Media deleted successfully",
      deletedId: mediaId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
