import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET - Fetch all admins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("users")
      .select("*")
      .in("role", ["SUPER_ADMIN", "ADMIN"])
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,name.ilike.%${search}%`
      );
    }

    const { data: admins, error } = await query;

    if (error) {
      console.error("Error fetching admins:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      admins: admins || [],
      total: admins?.length || 0,
    });
  } catch (error: any) {
    console.error("Admins API error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role = "ADMIN" } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields: email, name" },
        { status: 400 }
      );
    }

    // Verify role is valid
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be SUPER_ADMIN, ADMIN, or EDITOR" },
        { status: 400 }
      );
    }

    // Check if user already exists as admin
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", email);

    if (existingUser && existingUser.length > 0) {
      const user = existingUser[0];
      // If user exists but is not an admin, convert to admin
      if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role)) {
        // Update existing user to admin
        const { data: updatedAdmin, error: updateError } = await supabase
          .from("users")
          .update({ role, active: true })
          .eq("email", email)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating user to admin:", updateError);
          return NextResponse.json(
            { error: updateError.message },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: "User converted to admin successfully",
            admin: updatedAdmin,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Admin with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Create new admin user
    const { data: newAdmin, error } = await supabase
      .from("users")
      .insert({
        email,
        name,
        role,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
