'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Restaurant extends SectionData {
  id: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: 'rest-1',
      type: 'Restaurant',
      title: 'Pizza Palace',
      imageUrl: '/img/restaurant1.jpg',
      description: 'Delicious Italian pizza and pasta',
      buttonText: 'View Menu',
      visible: true,
    },
    {
      id: 'rest-2',
      type: 'Restaurant',
      title: 'Burger Barn',
      imageUrl: '/img/restaurant2.jpg',
      description: 'Best burgers in town',
      buttonText: 'View Menu',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Restaurant) => {
    setRestaurants(restaurants.map((r) => (r.id === id ? updated : r)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setRestaurants(restaurants.filter((r) => r.id !== id));
    }
  };

  const handleAdd = () => {
    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      type: 'Restaurant',
      title: 'New Restaurant',
      description: 'Restaurant description',
      imageUrl: '',
      buttonText: 'View Menu',
      visible: true,
    };
    setRestaurants([...restaurants, newRest]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Restaurants Listing
              </h1>
              <p className="text-gray-600">Manage food service restaurants</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Restaurant
            </button>
          </div>

          <div className="space-y-4">
            {restaurants.map((r) => (
              <SectionEditor
                key={r.id}
                section={r}
                onUpdate={(u) => handleUpdate(r.id, u as Restaurant)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Restaurants Preview">
            <div className="grid grid-cols-1 gap-4">
              {restaurants.filter(r => r.visible).map((r) => (
                <div key={r.id} className="border rounded-lg overflow-hidden">
                  {r.imageUrl && (
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{r.description}</p>
                    <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
                      {r.buttonText}
                    </button>
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
