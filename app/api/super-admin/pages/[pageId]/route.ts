import { NextRequest, NextResponse } from "next/server";

// GET - Fetch specific page with sections
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;

    // TODO: Fetch page from database with all sections
    const page = {
      id: pageId,
      slug: "landing",
      title: "Landing Page",
      description: "Main landing page",
      status: "PUBLISHED",
      service: "LANDING_PAGE",
      sections: [
        {
          id: "sec-1",
          type: "hero",
          title: "Welcome to UserDash",
          order: 0,
          visible: true,
          props: {
            headline: "Your All-in-One Platform",
            subheadline: "Food, Rides, Parcels",
            backgroundImage: "/img/hero.jpg",
            cta: { text: "Get Started", link: "/register" },
          },
        },
        {
          id: "sec-2",
          type: "features",
          title: "Our Services",
          order: 1,
          visible: true,
          props: {
            cards: [
              {
                title: "Food Delivery",
                description: "Order from your favorite restaurants",
                icon: "🍕",
              },
            ],
          },
        },
      ],
    };

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// PUT - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;
    const body = await request.json();

    // TODO: Update page in database
    // Validate input
    // Create draft if necessary

    return NextResponse.json({
      message: "Page updated successfully",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;

    // TODO: Delete page from database

    return NextResponse.json({
      message: "Page deleted successfully",
      deletedId: pageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
