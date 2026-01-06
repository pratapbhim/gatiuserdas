'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Users,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Eye,
  MousePointerClick,
} from 'lucide-react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';

interface ServiceStats {
  name: string;
  icon: React.ReactNode;
  value: string | number;
  change: number;
  color: string;
}

interface PagePerformance {
  name: string;
  views: number;
  clicks: number;
  conversionRate: number;
}

export default function SuperAdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/super-admin/analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const serviceStats: ServiceStats[] = [
    {
      name: 'Total Orders',
      icon: <ShoppingCart size={24} />,
      value: analytics?.overview?.totalOrders || 0,
      change: 12.5,
      color: 'blue',
    },
    {
      name: 'Total Users',
      icon: <Users size={24} />,
      value: analytics?.overview?.totalUsers || 0,
      change: 8.2,
      color: 'green',
    },
    {
      name: 'Revenue',
      icon: <IndianRupee size={24} />,
      value: `₹${(analytics?.overview?.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: 15.3,
      color: 'purple',
    },
    {
      name: 'Page Views',
      icon: <Eye size={24} />,
      value: analytics?.overview?.pageViews || 0,
      change: 5.8,
      color: 'orange',
    },
  ];

  const StatCard = ({ stat }: { stat: ServiceStats }) => {
    const colorClasses = {
      blue: 'from-blue-50 to-blue-100 text-blue-600',
      green: 'from-green-50 to-green-100 text-green-600',
      purple: 'from-purple-50 to-purple-100 text-purple-600',
      orange: 'from-orange-50 to-orange-100 text-orange-600',
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} p-6 rounded-lg shadow-md`}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl opacity-70">{stat.icon}</div>
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <TrendingUp size={16} />
            +{stat.change}%
          </div>
        </div>
        <h3 className="text-sm font-medium opacity-70 mb-1">{stat.name}</h3>
        <p className="text-3xl font-bold">{stat.value}</p>
      </div>
    );
  };

  const PerformanceTable = ({ data }: { data: PagePerformance[] | undefined }) => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500">No data available</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Page Name
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Views
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Clicks
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Conversion
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((page, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium text-gray-900">{page.name}</td>
                <td className="py-4 px-4 text-right text-gray-600">
                  {page.views.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-gray-600">
                  {page.clicks.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {(page.conversionRate * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {activity.user} <span className="text-gray-600">{activity.action}</span> <span className="text-gray-900 font-semibold">{activity.resource}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <SuperAdminDashboard>
        <div className="p-8 space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </SuperAdminDashboard>
    );
  }

  return (
    <SuperAdminDashboard>
      <div className="p-8 space-y-8">
        {/* Overview Stats */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceStats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>
        </section>

        {/* Service Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {analytics?.serviceBreakdown &&
            Object.entries(analytics.serviceBreakdown).map(([service, stats]: any) => (
              <div
                key={service}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h4 className="font-semibold text-gray-900 mb-4 capitalize">
                  {service === 'FOOD'
                    ? 'Food Service'
                    : service === 'RIDE'
                    ? 'Ride Service'
                    : 'Parcel Service'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.orders.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{stats.revenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-lg font-bold text-blue-600">
                      {stats.users.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </section>

        {/* Page Performance */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} />
            Page Performance
          </h3>
          <PerformanceTable data={analytics?.topPages} />
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {analytics?.recentActivity.map((activity: any) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>
    </SuperAdminDashboard>
  );
}
