'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Calendar, Shield, Lock } from 'lucide-react';
import { UserBlockingControl } from './UserBlockingControl';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  blockedServices: {
    main_page: boolean;
    food: boolean;
    person: boolean;
    parcel: boolean;
  };
  isFullyBlocked?: boolean;
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (user: User) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [localUser, setLocalUser] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  if (!isOpen || !localUser) {
    return null;
  }

  const handleBlockingUpdate = (blockedServices: any) => {
    const updated = {
      ...localUser,
      blockedServices,
      isFullyBlocked: blockedServices.main_page,
    };
    setLocalUser(updated);
    onUpdate?.(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-600">Manage user access and blocking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-blue-600" />
                <p className="text-sm text-gray-600">Email</p>
              </div>
              <p className="font-semibold text-gray-900">{localUser.email}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={18} className="text-green-600" />
                <p className="text-sm text-gray-600">Name</p>
              </div>
              <p className="font-semibold text-gray-900">{localUser.name || 'Not provided'}</p>
            </div>

            {localUser.created_at && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={18} className="text-purple-600" />
                  <p className="text-sm text-gray-600">Joined</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(localUser.created_at).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={18} className={localUser.isFullyBlocked ? 'text-red-600' : 'text-green-600'} />
                <p className="text-sm text-gray-600">Status</p>
              </div>
              <p className={`font-semibold ${localUser.isFullyBlocked ? 'text-red-600' : 'text-green-600'}`}>
                {localUser.isFullyBlocked ? '🚫 Blocked' : '✅ Active'}
              </p>
            </div>
          </div>

          {/* Blocking Control */}
          <UserBlockingControl
            userId={localUser.id}
            blockedServices={localUser.blockedServices}
            onUpdate={handleBlockingUpdate}
            isLoading={isLoading}
          />

          {/* Activity Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">User ID</h4>
            <p className="text-sm text-blue-700 font-mono break-all">{localUser.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
