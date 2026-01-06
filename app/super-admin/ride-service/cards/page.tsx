'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface ServiceCard extends SectionData {
  id: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<ServiceCard[]>([
    {
      id: 'card-1',
      type: 'Card',
      title: 'Safety First',
      description: 'All drivers are verified and insured',
      imageUrl: '/img/safety-icon.jpg',
      visible: true,
    },
    {
      id: 'card-2',
      type: 'Card',
      title: 'Real-Time Tracking',
      description: 'Track your ride in real-time',
      imageUrl: '/img/tracking-icon.jpg',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: ServiceCard) => {
    setCards(cards.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setCards(cards.filter((c) => c.id !== id));
    }
  };

  const handleAdd = () => {
    const newCard: ServiceCard = {
      id: `card-${Date.now()}`,
      type: 'Card',
      title: 'New Feature',
      description: 'Feature description',
      imageUrl: '',
      visible: true,
    };
    setCards([...cards, newCard]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Service Cards
              </h1>
              <p className="text-gray-600">Manage ride service feature cards</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Card
            </button>
          </div>

          <div className="space-y-4">
            {cards.map((c) => (
              <SectionEditor
                key={c.id}
                section={c}
                onUpdate={(u) => handleUpdate(c.id, u as ServiceCard)}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Cards Preview">
            <div className="grid grid-cols-1 gap-4">
              {cards.filter(c => c.visible).map((c) => (
                <div key={c.id} className="border rounded-lg overflow-hidden">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.description}</p>
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
