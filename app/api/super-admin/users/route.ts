import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all users with their blocking status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch users from Supabase
    let query = supabase.from("users").select("*");

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: users, error } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Fetch blocking status for each user
    const usersWithBlocks = await Promise.all(
      (users || []).map(async (user) => {
        const { data: blocks, error: blockError } = await supabase
          .from("user_service_blocks")
          .select("*")
          .eq("user_id", user.id);

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

        return {
          ...user,
          blockedServices,
          isFullyBlocked: blockedServices.main_page,
        };
      })
    );

    return NextResponse.json({
      users: usersWithBlocks,
      total: usersWithBlocks.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Block/unblock user for specific services
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, blockedServices } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First, delete all existing blocks for this user
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

    // Create new blocks based on current selections
    const blocksList = [];

    if (blockedServices.main_page) {
      blocksList.push({
        user_id: userId,
        service_type: "MAIN_PAGE",
        blocked_at: new Date().toISOString(),
        blocked_by: "SUPER_ADMIN",
      });
    } else {
      // If main page is not blocked, create individual service blocks
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

    // Insert new blocks if any
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
      message: "User blocks updated successfully",
      userId,
      blockedServices,
    });
  } catch (error) {
    console.error("Error updating user blocks:", error);
    return NextResponse.json(
      { error: "Failed to update user blocks" },
      { status: 500 }
    );
  }
}
