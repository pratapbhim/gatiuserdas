import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET - Fetch single admin
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: admin, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(admin.role)) {
      return NextResponse.json(
        { error: "User is not an admin" },
        { status: 403 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Fetch admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update admin
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, role, active } = body;

    // Validate role if provided
    if (role && !["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be SUPER_ADMIN, ADMIN, or EDITOR" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (active !== undefined) updateData.active = active;

    const { data: updatedAdmin, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating admin:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error: any) {
    console.error("Update admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prevent deleting if this is the last super admin
    const { data: allAdmins } = await supabase
      .from("users")
      .select("id, role")
      .eq("role", "SUPER_ADMIN");

    const { data: adminToDelete } = await supabase
      .from("users")
      .select("role")
      .eq("id", params.id)
      .single();

    if (
      adminToDelete?.role === "SUPER_ADMIN" &&
      allAdmins &&
      allAdmins.length <= 1
    ) {
      return NextResponse.json(
        { error: "Cannot delete the last super admin" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting admin:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
