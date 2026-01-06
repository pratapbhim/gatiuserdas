'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Banner extends SectionData {
  id: string;
}

export default function BannersOffersPage() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'banner-1',
      type: 'Banner',
      title: '50% Off on First Order',
      imageUrl: '/img/offer1.jpg',
      description: 'Use code FIRST50',
      visible: true,
    },
    {
      id: 'banner-2',
      type: 'Banner',
      title: 'Free Delivery Above ₹299',
      imageUrl: '/img/offer2.jpg',
      description: 'Minimum order value applies',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Banner) => {
    setBanners(banners.map((b) => (b.id === id ? updated : b)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  const handleAdd = () => {
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      type: 'Banner',
      title: 'New Offer',
      imageUrl: '',
      visible: true,
    };
    setBanners([...banners, newBanner]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Banners & Offers
              </h1>
              <p className="text-gray-600">Manage promotional banners</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Banner
            </button>
          </div>

          <div className="space-y-4">
            {banners.map((b) => (
              <SectionEditor
                key={b.id}
                section={b}
                onUpdate={(u) => handleUpdate(b.id, u as Banner)}
                onDelete={() => handleDelete(b.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Banners Preview">
            <div className="space-y-4">
              {banners.filter(b => b.visible).map((b) => (
                <div key={b.id} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg overflow-hidden text-white">
                  {b.imageUrl && (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-full h-20 object-cover opacity-70"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{b.title}</h3>
                    {b.description && (
                      <p className="text-sm opacity-90">{b.description}</p>
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
