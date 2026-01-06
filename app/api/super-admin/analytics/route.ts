import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET - Fetch analytics dashboard data from Supabase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service"); // LANDING_PAGE, FOOD, RIDE, PARCEL
    const days = parseInt(searchParams.get("days") || "30");

    // Fetch all users count
    const { data: allUsers, error: usersError } = await supabase
      .from("users")
      .select("id", { count: "exact" });

    if (usersError) console.warn("Users error:", usersError);
    const totalUsers = allUsers?.length || 0;

    // Fetch all orders for each service
    let totalOrders = 0;
    let totalRevenue = 0;
    let foodStats = { orders: 0, revenue: 0, users: 0 };
    let rideStats = { orders: 0, revenue: 0, users: 0 };
    let parcelStats = { orders: 0, revenue: 0, users: 0 };

    // Food Service Orders - from food_orders table
    const { data: foodOrders, error: foodError } = await supabase
      .from("food_orders")
      .select("*");

    if (foodError) console.warn("Food orders error:", foodError);
    if (foodOrders && Array.isArray(foodOrders)) {
      foodStats.orders = foodOrders.length;
      // Only count DELIVERED orders in revenue
      const deliveredFood = foodOrders.filter((o) => o.status === "DELIVERED");
      foodStats.revenue = deliveredFood.reduce(
        (sum, o) => sum + (parseFloat(o.total_amount) || 0),
        0
      );
      foodStats.users = new Set(foodOrders.map((o) => o.user_id)).size;
      totalOrders += foodOrders.length;
      totalRevenue += foodStats.revenue;
    }

    // Ride Service Orders - from person_orders table
    const { data: rideOrders, error: rideError } = await supabase
      .from("person_orders")
      .select("*");

    if (rideError) console.warn("Ride orders error:", rideError);
    if (rideOrders && Array.isArray(rideOrders)) {
      rideStats.orders = rideOrders.length;
      // Only count DELIVERED orders in revenue
      const deliveredRide = rideOrders.filter((o) => o.status === "DELIVERED");
      rideStats.revenue = deliveredRide.reduce(
        (sum, o) => sum + (parseFloat(o.total_amount) || 0),
        0
      );
      rideStats.users = new Set(rideOrders.map((o) => o.user_id)).size;
      totalOrders += rideOrders.length;
      totalRevenue += rideStats.revenue;
    }

    // Parcel Service Orders - from parcel_orders table
    const { data: parcelOrders, error: parcelError } = await supabase
      .from("parcel_orders")
      .select("*");

    if (parcelError) console.warn("Parcel orders error:", parcelError);
    if (parcelOrders && Array.isArray(parcelOrders)) {
      parcelStats.orders = parcelOrders.length;
      // Only count DELIVERED orders in revenue
      const deliveredParcel = parcelOrders.filter((o) => o.status === "DELIVERED");
      parcelStats.revenue = deliveredParcel.reduce(
        (sum, o) => sum + (parseFloat(o.total_amount) || 0),
        0
      );
      parcelStats.users = new Set(parcelOrders.map((o) => o.user_id)).size;
      totalOrders += parcelOrders.length;
      totalRevenue += parcelStats.revenue;
    }

    // Fetch page analytics
    let pageViews = [];
    try {
      const { data } = await supabase
        .from("page_analytics")
        .select("*")
        .limit(10)
        .order("created_at", { ascending: false });
      pageViews = data || [];
    } catch (err) {
      console.warn("Page analytics error:", err);
    }

    // Fetch recent activity
    let activityLogs = [];
    try {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .limit(10)
        .order("created_at", { ascending: false });
      activityLogs = data || [];
    } catch (err) {
      console.warn("Activity logs error:", err);
    }

    const analytics = {
      overview: {
        totalOrders,
        totalUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pageViews: pageViews.length,
      },
      serviceBreakdown: {
        FOOD: {
          orders: foodStats.orders,
          revenue: Math.round(foodStats.revenue * 100) / 100,
          users: foodStats.users,
        },
        RIDE: {
          orders: rideStats.orders,
          revenue: Math.round(rideStats.revenue * 100) / 100,
          users: rideStats.users,
        },
        PARCEL: {
          orders: parcelStats.orders,
          revenue: Math.round(parcelStats.revenue * 100) / 100,
          users: parcelStats.users,
        },
      },
      topPages: (pageViews || [])
        .slice(0, 5)
        .map((page: any, idx: number) => ({
          name: page.page_name || `Page ${idx + 1}`,
          views: page.view_count || 0,
          clicks: page.click_count || 0,
          conversionRate: (page.conversion_rate || 0).toFixed(3),
        })),
      recentActivity: (activityLogs || []).map((activity: any) => ({
        id: activity.id,
        user: activity.user_email || activity.user_name || "System",
        action: activity.action || "performed",
        resource: activity.resource_name || "resource",
        timestamp: activity.created_at || new Date().toISOString(),
      })),
    };

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      {
        overview: {
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          pageViews: 0,
        },
        serviceBreakdown: {
          FOOD: { orders: 0, revenue: 0, users: 0 },
          RIDE: { orders: 0, revenue: 0, users: 0 },
          PARCEL: { orders: 0, revenue: 0, users: 0 },
        },
        topPages: [],
        recentActivity: [],
        error: error.message,
      },
      { status: 200 }
    );
  }
}
