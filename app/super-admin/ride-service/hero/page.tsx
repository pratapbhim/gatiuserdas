'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';

export default function RideHeroPage() {
  const [section, setSection] = useState<SectionData>({
    id: 'ride-hero-1',
    type: 'Hero',
    heading: 'Book Your Ride Now',
    subtitle: 'Safe, reliable, and affordable transportation',
    imageUrl: '/img/ride-hero.jpg',
    imageAlt: 'Ride booking hero',
    buttonText: 'Book Now',
    buttonLink: '/ride/book',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    visible: true,
  });

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ride Service - Hero Section
            </h1>
            <p className="text-gray-600">Edit the hero section for ride booking</p>
          </div>

          <SectionEditor section={section} onUpdate={setSection} />
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Hero Preview">
            <div
              style={{
                backgroundColor: section.backgroundColor,
                color: section.textColor,
              }}
              className="p-8 rounded-lg text-center"
            >
              <h1 className="text-4xl font-bold mb-4">{section.heading}</h1>
              <p className="text-lg mb-8">{section.subtitle}</p>
              {section.imageUrl && (
                <img
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              {section.buttonText && (
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
                  {section.buttonText}
                </button>
              )}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
