'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';

export default function BookingFormPage() {
  const [section, setSection] = useState<SectionData>({
    id: 'booking-form-1',
    type: 'Booking Form',
    title: 'Book Your Ride',
    description: 'Enter your location details',
    visible: true,
  });

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Form
            </h1>
            <p className="text-gray-600">Customize the ride booking form</p>
          </div>

          <SectionEditor section={section} onUpdate={setSection} />
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Form Preview">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {section.title}
                </label>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
              </div>
              <input
                type="text"
                placeholder="Pickup Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Dropoff Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                Book Ride
              </button>
            </form>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
