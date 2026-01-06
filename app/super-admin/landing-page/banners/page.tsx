'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus, Trash2 } from 'lucide-react';

interface Banner extends SectionData {
  id: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'banner-1',
      type: 'Banner',
      title: 'Special Offer',
      imageUrl: '/img/banner1.jpg',
      imageAlt: 'Special offer banner',
      buttonText: 'Claim Offer',
      buttonLink: '/offers',
      visible: true,
    },
    {
      id: 'banner-2',
      type: 'Banner',
      title: 'Free Delivery',
      imageUrl: '/img/banner2.jpg',
      imageAlt: 'Free delivery banner',
      buttonText: 'Shop Now',
      buttonLink: '/food',
      visible: true,
    },
  ]);

  const handleUpdateBanner = (id: string, updatedBanner: Banner) => {
    setBanners(
      banners.map((b) => (b.id === id ? updatedBanner : b))
    );
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      type: 'Banner',
      title: 'New Banner',
      imageUrl: '',
      buttonText: 'Learn More',
      visible: true,
    };
    setBanners([...banners, newBanner]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        {/* Editor */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Banners
              </h1>
              <p className="text-gray-600">
                Manage landing page banners and promotional content
              </p>
            </div>
            <button
              onClick={handleAddBanner}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Banner
            </button>
          </div>

          <div className="space-y-4">
            {banners.map((banner) => (
              <SectionEditor
                key={banner.id}
                section={banner}
                onUpdate={(updated) => handleUpdateBanner(banner.id, updated as Banner)}
                onDelete={() => handleDeleteBanner(banner.id)}
              />
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-96 hidden lg:block">
          <LivePreview title="Banners Preview">
            <div className="space-y-4">
              {banners.filter(b => b.visible).map((banner) => (
                <div
                  key={banner.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {banner.imageUrl && (
                    <img
                      src={banner.imageUrl}
                      alt={banner.imageAlt}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold mb-2">{banner.title}</h3>
                    {banner.buttonText && (
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        {banner.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
