import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { section, filters = {} } = await request.json();

    let stats: any = {};

    // FOOD ORDERS STATS
    if (section === 'food-orders') {
      const { startDate, endDate, status } = filters;

      // Total orders
      let ordersQuery = supabase.from('orders').select('count()', { count: 'exact', head: true });
      if (startDate && endDate) {
        ordersQuery = ordersQuery.gte('created_at', startDate).lte('created_at', endDate);
      }
      if (status) {
        ordersQuery = ordersQuery.eq('status', status);
      }
      const { count: totalOrders } = await ordersQuery;

      // Today's orders
      const today = new Date().toISOString().split('T')[0];
      const { count: todayOrders } = await supabase
        .from('orders')
        .select('count()', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      // Revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', startDate || `${today}T00:00:00`);
      const revenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Status breakdown
      const { data: statusData } = await supabase
        .from('orders')
        .select('status, count(*)')
        .groupBy('status');

      stats = {
        totalOrders,
        todayOrders,
        revenue,
        statusBreakdown: statusData || []
      };
    }

    // PARCEL BOOKINGS STATS
    if (section === 'parcel-bookings') {
      const { startDate, endDate, status } = filters;

      let bookingsQuery = supabase.from('parcel_bookings').select('count()', { count: 'exact', head: true });
      if (startDate && endDate) {
        bookingsQuery = bookingsQuery.gte('created_at', startDate).lte('created_at', endDate);
      }
      if (status) {
        bookingsQuery = bookingsQuery.eq('status', status);
      }
      const { count: totalBookings } = await bookingsQuery;

      // Delivery status
      const { data: deliveryStatus } = await supabase
        .from('parcel_bookings')
        .select('status, count(*)')
        .groupBy('status');

      // Cancellations
      const { count: cancellations } = await supabase
        .from('parcel_bookings')
        .select('count()', { count: 'exact', head: true })
        .eq('status', 'cancelled');

      stats = {
        totalBookings,
        deliveryStatus: deliveryStatus || [],
        cancellations
      };
    }

    // RIDE BOOKINGS STATS
    if (section === 'ride-bookings') {
      const { startDate, endDate, status } = filters;

      let ridesQuery = supabase.from('ride_bookings').select('count()', { count: 'exact', head: true });
      if (startDate && endDate) {
        ridesQuery = ridesQuery.gte('created_at', startDate).lte('created_at', endDate);
      }
      if (status) {
        ridesQuery = ridesQuery.eq('status', status);
      }
      const { count: totalRides } = await ridesQuery;

      // Vehicle type breakdown
      const { data: vehicleData } = await supabase
        .from('ride_bookings')
        .select('vehicle_type, count(*)')
        .groupBy('vehicle_type');

      stats = {
        totalRides,
        vehicleBreakdown: vehicleData || []
      };
    }

    // PAYMENTS STATS
    if (section === 'payments') {
      const { startDate, endDate, status, service } = filters;

      let paymentsQuery = supabase.from('payments').select('count()', { count: 'exact', head: true });
      if (startDate && endDate) {
        paymentsQuery = paymentsQuery.gte('created_at', startDate).lte('created_at', endDate);
      }
      if (status) {
        paymentsQuery = paymentsQuery.eq('status', status);
      }
      if (service) {
        paymentsQuery = paymentsQuery.eq('service_type', service);
      }
      const { count: totalPayments } = await paymentsQuery;

      // Payment method breakdown
      const { data: methodData } = await supabase
        .from('payments')
        .select('payment_method, count(*)')
        .groupBy('payment_method');

      stats = {
        totalPayments,
        methodBreakdown: methodData || []
      };
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
