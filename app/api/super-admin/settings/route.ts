import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all global settings
export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from database
    const settings = {
      brandName: "UserDash",
      logoUrl: "/img/logo.png",
      primaryColor: "#3B82F6",
      secondaryColor: "#1F2937",
      accentColor: "#10B981",
      supportEmail: "support@userdash.com",
      metaTitle: "UserDash - One Platform, Multiple Services",
      metaDescription:
        "Food delivery, ride-sharing, and parcel delivery in one app",
    };

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update global settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Update database
    // Validate and update settings

    return NextResponse.json({
      message: "Settings updated successfully",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
