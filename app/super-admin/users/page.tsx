'use client';

import React, { useState, useEffect } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { UserDetailModal } from '@/components/super-admin/UserDetailModal';
import { Search, Lock, Unlock, MoreVertical, AlertCircle } from 'lucide-react';

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

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/super-admin/users');
      const data = await response.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setFilteredUsers(filteredUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const getServiceStatus = (user: User) => {
    if (user.isFullyBlocked) {
      return { label: 'All Blocked', color: 'red' };
    }

    const blockedCount = [
      user.blockedServices.food,
      user.blockedServices.person,
      user.blockedServices.parcel,
    ].filter(Boolean).length;

    if (blockedCount === 0) {
      return { label: 'All Active', color: 'green' };
    }

    return { label: `${blockedCount} Service(s) Blocked`, color: 'yellow' };
  };

  return (
    <SuperAdminDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Manage user access and block services per user
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => !u.isFullyBlocked).length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Blocked Users</p>
            <p className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.isFullyBlocked).length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Partial Blocks</p>
            <p className="text-3xl font-bold text-yellow-600">
              {users.filter(
                (u) =>
                  !u.isFullyBlocked &&
                  (u.blockedServices.food ||
                    u.blockedServices.person ||
                    u.blockedServices.parcel)
              ).length}
            </p>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <AlertCircle className="text-blue-600 mx-auto mb-3" size={32} />
            <p className="text-blue-900 font-medium">No users found</p>
            <p className="text-blue-700 text-sm">
              {search ? 'Try adjusting your search criteria' : 'No users in the system yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => {
              const status = getServiceStatus(user);
              const statusColors = {
                red: 'bg-red-50 border-red-200 text-red-700',
                green: 'bg-green-50 border-green-200 text-green-700',
                yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
              };

              return (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{user.email}</h3>
                        {user.isFullyBlocked ? (
                          <Lock size={16} className="text-red-600" />
                        ) : (
                          <Unlock size={16} className="text-green-600" />
                        )}
                      </div>
                      {user.name && (
                        <p className="text-sm text-gray-600 mb-2">{user.name}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {user.blockedServices.main_page && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            🚫 Platform Blocked
                          </span>
                        )}
                        {!user.blockedServices.main_page && (
                          <>
                            {user.blockedServices.food && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                🍕 Food Blocked
                              </span>
                            )}
                            {user.blockedServices.person && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                🚗 Ride Blocked
                              </span>
                            )}
                            {user.blockedServices.parcel && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                📦 Parcel Blocked
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${statusColors[status.color as keyof typeof statusColors]}`}>
                      {status.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUserUpdate}
      />
    </SuperAdminDashboard>
  );
}
