'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Home,
  UtensilsCrossed,
  Car,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Users,
} from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  badge,
  isActive,
}) => (
  <Link
    href={href}
    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

interface SuperAdminDashboardProps {
  children: ReactNode;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedService, setExpandedService] = useState<string | null>(
    'landing-page'
  );
  const pathname = usePathname();

  const services = [
    {
      id: 'landing-page',
      name: 'Main Landing Page',
      icon: <Home size={20} />,
      links: [
        { label: 'Manage Sections', href: '/super-admin/landing-page' },
        { label: 'Edit Hero Section', href: '/super-admin/landing-page/hero' },
        { label: 'Edit Banners', href: '/super-admin/landing-page/banners' },
        {
          label: 'Manage Cards',
          href: '/super-admin/landing-page/cards',
        },
        {
          label: 'Content Blocks',
          href: '/super-admin/landing-page/content',
        },
      ],
    },
    {
      id: 'food-service',
      name: 'Food Service',
      icon: <UtensilsCrossed size={20} />,
      links: [
        { label: 'Manage Pages', href: '/super-admin/food-service' },
        {
          label: 'Restaurants Listing',
          href: '/super-admin/food-service/restaurants',
        },
        { label: 'Categories', href: '/super-admin/food-service/categories' },
        { label: 'Banners & Offers', href: '/super-admin/food-service/banners' },
        {
          label: 'Order Page Components',
          href: '/super-admin/food-service/order-page',
        },
      ],
    },
    {
      id: 'ride-service',
      name: 'Person/Ride Service',
      icon: <Car size={20} />,
      links: [
        { label: 'Manage Pages', href: '/super-admin/ride-service' },
        {
          label: 'Hero Section',
          href: '/super-admin/ride-service/hero',
        },
        {
          label: 'Booking Form',
          href: '/super-admin/ride-service/booking-form',
        },
        {
          label: 'Pricing Blocks',
          href: '/super-admin/ride-service/pricing',
        },
        { label: 'Service Cards', href: '/super-admin/ride-service/cards' },
      ],
    },
    {
      id: 'parcel-service',
      name: 'Parcel Service',
      icon: <Package size={20} />,
      links: [
        { label: 'Manage Pages', href: '/super-admin/parcel-service' },
        { label: 'Hero Section', href: '/super-admin/parcel-service/hero' },
        {
          label: 'Booking Flow',
          href: '/super-admin/parcel-service/booking-flow',
        },
        { label: 'Pricing & Rules', href: '/super-admin/parcel-service/pricing' },
        { label: 'SOP Content', href: '/super-admin/parcel-service/sop' },
        { label: 'Warnings & Alerts', href: '/super-admin/parcel-service/warnings' },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;
  const isServiceActive = (id: string) =>
    pathname.includes(id.replace('-', '/').split('/')[0]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-blue-600">UserDash</h1>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Dashboard */}
          <SidebarLink
            href="/super-admin"
            icon={<BarChart3 size={20} />}
            label={sidebarOpen ? 'Dashboard' : ''}
            isActive={isActive('/super-admin')}
          />

          {/* Services */}
          {services.map((service) => (
            <div key={service.id}>
              <button
                onClick={() =>
                  setExpandedService(
                    expandedService === service.id ? null : service.id
                  )
                }
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isServiceActive(service.id)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {service.icon}
                  {sidebarOpen && (
                    <span className="font-medium text-sm">{service.name}</span>
                  )}
                </div>
                {sidebarOpen && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedService === service.id ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Sub-links */}
              {sidebarOpen && expandedService === service.id && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200">
                  {service.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-sm rounded transition-colors ${
                        isActive(link.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* User Management */}
          <SidebarLink
            href="/super-admin/users"
            icon={<Users size={20} />}
            label={sidebarOpen ? 'User Management' : ''}
            isActive={isActive('/super-admin/users')}
          />

          {/* Admin Management */}
          <SidebarLink
            href="/super-admin/admins"
            icon={<Users size={20} />}
            label={sidebarOpen ? 'Admin Management' : ''}
            isActive={isActive('/super-admin/admins')}
          />

          {/* Settings */}
          <SidebarLink
            href="/super-admin/settings"
            icon={<Settings size={20} />}
            label={sidebarOpen ? 'Settings' : ''}
            isActive={isActive('/super-admin/settings')}
          />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Super Admin Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@userdash.com</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
