'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';

export default function HeroSectionPage() {
  const [section, setSection] = useState<SectionData>({
    id: 'hero-1',
    type: 'Hero',
    heading: 'Welcome to Our Platform',
    subtitle: 'Order food, book rides, and send parcels in one place',
    imageUrl: '/img/hero-banner.jpg',
    imageAlt: 'Hero section banner',
    buttonText: 'Get Started',
    buttonLink: '/register',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    visible: true,
  });

  const handleUpdate = (updatedSection: SectionData) => {
    setSection(updatedSection);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        {/* Editor */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Hero Section
            </h1>
            <p className="text-gray-600">
              Customize the main landing page hero section
            </p>
          </div>

          <SectionEditor section={section} onUpdate={handleUpdate} />
        </div>

        {/* Live Preview */}
        <div className="w-96 hidden lg:block">
          <LivePreview title="Hero Section Preview">
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
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
