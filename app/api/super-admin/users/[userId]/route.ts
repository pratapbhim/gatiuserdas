import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get single user details with blocking status
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch blocks
    const { data: blocks, error: blockError } = await supabase
      .from("user_service_blocks")
      .select("*")
      .eq("user_id", userId);

    const blockedServices = {
      main_page: false,
      food: false,
      person: false,
      parcel: false,
    };

    if (blocks && blocks.length > 0) {
      blocks.forEach((block: any) => {
        if (block.service_type === "MAIN_PAGE") blockedServices.main_page = true;
        if (block.service_type === "FOOD") blockedServices.food = true;
        if (block.service_type === "PERSON") blockedServices.person = true;
        if (block.service_type === "PARCEL") blockedServices.parcel = true;
      });
    }

    return NextResponse.json({
      ...user,
      blockedServices,
      isFullyBlocked: blockedServices.main_page,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Update user block status
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { blockedServices } = body;

    // Delete all existing blocks for this user
    const { error: deleteError } = await supabase
      .from("user_service_blocks")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 400 }
      );
    }

    // Create new blocks
    const blocksList = [];

    if (blockedServices.main_page) {
      blocksList.push({
        user_id: userId,
        service_type: "MAIN_PAGE",
        blocked_at: new Date().toISOString(),
        blocked_by: "SUPER_ADMIN",
      });
    } else {
      if (blockedServices.food) {
        blocksList.push({
          user_id: userId,
          service_type: "FOOD",
          blocked_at: new Date().toISOString(),
          blocked_by: "SUPER_ADMIN",
        });
      }
      if (blockedServices.person) {
        blocksList.push({
          user_id: userId,
          service_type: "PERSON",
          blocked_at: new Date().toISOString(),
          blocked_by: "SUPER_ADMIN",
        });
      }
      if (blockedServices.parcel) {
        blocksList.push({
          user_id: userId,
          service_type: "PARCEL",
          blocked_at: new Date().toISOString(),
          blocked_by: "SUPER_ADMIN",
        });
      }
    }

    if (blocksList.length > 0) {
      const { error: insertError } = await supabase
        .from("user_service_blocks")
        .insert(blocksList);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "User blocks updated",
      userId,
      blockedServices,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
