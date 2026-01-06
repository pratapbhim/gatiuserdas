'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Card extends SectionData {
  id: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 'card-1',
      type: 'Card',
      title: 'Food Delivery',
      imageUrl: '/img/food-icon.jpg',
      description: 'Order delicious food from your favorite restaurants',
      buttonText: 'Order Now',
      buttonLink: '/food',
      visible: true,
    },
    {
      id: 'card-2',
      type: 'Card',
      title: 'Ride Booking',
      imageUrl: '/img/ride-icon.jpg',
      description: 'Book a ride and travel safely',
      buttonText: 'Book Now',
      buttonLink: '/ride',
      visible: true,
    },
    {
      id: 'card-3',
      type: 'Card',
      title: 'Parcel Delivery',
      imageUrl: '/img/parcel-icon.jpg',
      description: 'Send parcels quickly and securely',
      buttonText: 'Send Now',
      buttonLink: '/parcel',
      visible: true,
    },
  ]);

  const handleUpdateCard = (id: string, updatedCard: Card) => {
    setCards(cards.map((c) => (c.id === id ? updatedCard : c)));
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setCards(cards.filter((c) => c.id !== id));
    }
  };

  const handleAddCard = () => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      type: 'Card',
      title: 'New Card',
      description: 'Card description',
      imageUrl: '',
      buttonText: 'Learn More',
      visible: true,
    };
    setCards([...cards, newCard]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        {/* Editor */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Service Cards
              </h1>
              <p className="text-gray-600">
                Manage service cards displayed on landing page
              </p>
            </div>
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Card
            </button>
          </div>

          <div className="space-y-4">
            {cards.map((card) => (
              <SectionEditor
                key={card.id}
                section={card}
                onUpdate={(updated) => handleUpdateCard(card.id, updated as Card)}
                onDelete={() => handleDeleteCard(card.id)}
              />
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-96 hidden lg:block">
          <LivePreview title="Cards Preview">
            <div className="grid grid-cols-1 gap-4">
              {cards.filter(c => c.visible).map((card) => (
                <div
                  key={card.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                    {card.buttonText && (
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        {card.buttonText}
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
