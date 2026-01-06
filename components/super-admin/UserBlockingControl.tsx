'use client';

import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface BlockedServices {
  main_page: boolean;
  food: boolean;
  person: boolean;
  parcel: boolean;
}

interface UserBlockingControlProps {
  userId: string;
  blockedServices: BlockedServices;
  onUpdate: (services: BlockedServices) => void;
  isLoading?: boolean;
}

export const UserBlockingControl: React.FC<UserBlockingControlProps> = ({
  userId,
  blockedServices,
  onUpdate,
  isLoading = false,
}) => {
  const [localServices, setLocalServices] = useState(blockedServices);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggle = (service: keyof BlockedServices) => {
    // If main_page is being checked, disable individual services
    if (service === 'main_page') {
      setLocalServices({
        main_page: !localServices.main_page,
        food: !localServices.main_page ? false : localServices.food,
        person: !localServices.main_page ? false : localServices.person,
        parcel: !localServices.main_page ? false : localServices.parcel,
      });
    } else {
      // Can't disable individual services if main_page is blocked
      if (!localServices.main_page) {
        setLocalServices({
          ...localServices,
          [service]: !localServices[service],
        });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockedServices: localServices,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update blocks');
      }

      onUpdate(localServices);
      setMessage({
        type: 'success',
        text: 'User blocks updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update blocks',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(localServices) !== JSON.stringify(blockedServices);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Service Access Control</h3>

      {localServices.main_page && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-900">Platform Fully Blocked</p>
            <p className="text-sm text-red-700">This user cannot access any service on the platform</p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {/* Main Page Block */}
        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={localServices.main_page}
            onChange={() => handleToggle('main_page')}
            disabled={isLoading || isSaving}
            className="w-5 h-5 mt-0.5 border-gray-300 rounded text-red-600 focus:ring-2 focus:ring-red-500 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">🚫 Block Main Platform</p>
            <p className="text-sm text-gray-600">
              User cannot access ANY service (Food, Ride, Parcel)
            </p>
          </div>
        </label>

        {/* Individual Service Blocks */}
        {!localServices.main_page && (
          <>
            <div className="pl-4 border-l-2 border-gray-200 space-y-3">
              {/* Food Service */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localServices.food}
                  onChange={() => handleToggle('food')}
                  disabled={isLoading || isSaving || localServices.main_page}
                  className="w-5 h-5 mt-0.5 border-gray-300 rounded text-orange-600 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">🍕 Block Food Service</p>
                  <p className="text-sm text-gray-600">
                    User cannot order food
                  </p>
                </div>
              </label>

              {/* Person/Ride Service */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localServices.person}
                  onChange={() => handleToggle('person')}
                  disabled={isLoading || isSaving || localServices.main_page}
                  className="w-5 h-5 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">🚗 Block Ride Service</p>
                  <p className="text-sm text-gray-600">
                    User cannot book rides
                  </p>
                </div>
              </label>

              {/* Parcel Service */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localServices.parcel}
                  onChange={() => handleToggle('parcel')}
                  disabled={isLoading || isSaving || localServices.main_page}
                  className="w-5 h-5 mt-0.5 border-gray-300 rounded text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">📦 Block Parcel Service</p>
                  <p className="text-sm text-gray-600">
                    User cannot send parcels
                  </p>
                </div>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Access Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">Current Access Status:</p>
        <div className="space-y-1 text-sm">
          {localServices.main_page ? (
            <p className="text-red-600">🚫 All services blocked</p>
          ) : (
            <>
              <p className={localServices.food ? 'text-red-600' : 'text-green-600'}>
                {localServices.food ? '❌' : '✅'} Food Service: {localServices.food ? 'Blocked' : 'Accessible'}
              </p>
              <p className={localServices.person ? 'text-red-600' : 'text-green-600'}>
                {localServices.person ? '❌' : '✅'} Ride Service: {localServices.person ? 'Blocked' : 'Accessible'}
              </p>
              <p className={localServices.parcel ? 'text-red-600' : 'text-green-600'}>
                {localServices.parcel ? '❌' : '✅'} Parcel Service: {localServices.parcel ? 'Blocked' : 'Accessible'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!hasChanges || isSaving || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <Save size={20} />
        {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
      </button>
    </div>
  );
};
