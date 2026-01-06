import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all pages for a service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service"); // LANDING_PAGE, FOOD, RIDE, PARCEL

    // TODO: Fetch pages from database
    const pages = {
      LANDING_PAGE: [
        {
          id: "1",
          slug: "landing",
          title: "Landing Page",
          description: "Main landing page",
          status: "PUBLISHED",
          service: "LANDING_PAGE",
        },
      ],
      FOOD: [
        {
          id: "2",
          slug: "restaurants",
          title: "Restaurants",
          description: "Restaurant listing page",
          status: "PUBLISHED",
          service: "FOOD",
        },
        {
          id: "3",
          slug: "food-order",
          title: "Food Order",
          description: "Food ordering page",
          status: "PUBLISHED",
          service: "FOOD",
        },
      ],
      RIDE: [
        {
          id: "4",
          slug: "ride",
          title: "Ride Service",
          description: "Ride booking page",
          status: "PUBLISHED",
          service: "RIDE",
        },
      ],
      PARCEL: [
        {
          id: "5",
          slug: "parcel",
          title: "Parcel Service",
          description: "Parcel delivery page",
          status: "PUBLISHED",
          service: "PARCEL",
        },
      ],
    };

    return NextResponse.json({
      service: service || "ALL",
      pages: service ? pages[service as keyof typeof pages] || [] : pages,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Create page in database
    // Validate input

    return NextResponse.json(
      {
        message: "Page created successfully",
        data: body,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
