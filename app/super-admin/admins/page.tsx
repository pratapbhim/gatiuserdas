"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, Shield, Calendar, Mail } from "lucide-react";
import { AdminDetailModal } from "@/components/super-admin/AdminDetailModal";
import { CreateAdminModal } from "@/components/super-admin/CreateAdminModal";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at?: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch admins
  const fetchAdmins = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/super-admin/admins");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data.admins || []);
      setFilteredAdmins(data.admins || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAdmins(admins);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query)
      );
      setFilteredAdmins(filtered);
    }
  }, [searchQuery, admins]);

  // Load data on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create admin
  const handleCreateAdmin = async (data: {
    email: string;
    name: string;
    role: string;
  }) => {
    try {
      const response = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create admin");
      }

      await fetchAdmins();
      setShowCreateModal(false);
    } catch (err: any) {
      throw new Error(err.message || "Failed to create admin");
    }
  };

  // Update admin
  const handleUpdateAdmin = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/super-admin/admins/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update admin");
      }

      await fetchAdmins();
      setSelectedAdmin(null);
    } catch (err: any) {
      throw new Error(err.message || "Failed to update admin");
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id: string) => {
    try {
      const response = await fetch(`/api/super-admin/admins/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete admin");
      }

      await fetchAdmins();
      setSelectedAdmin(null);
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete admin");
    }
  };

  const stats = {
    total: admins.length,
    superAdmins: admins.filter((a) => a.role === "SUPER_ADMIN").length,
    admins: admins.filter((a) => a.role === "ADMIN").length,
    active: admins.filter((a) => a.active).length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        <p className="text-gray-600 mt-2">
          Create and manage administrator accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Super Admins</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.superAdmins}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Admins</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.admins}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="ml-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Create Admin
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading admins...
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? "No admins found" : "No admins yet"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedAdmin(admin)}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{admin.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        admin.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admin.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar size={16} />
                      {formatDate(admin.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAdmin(admin);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <AdminDetailModal
        admin={selectedAdmin}
        onClose={() => setSelectedAdmin(null)}
        onUpdate={handleUpdateAdmin}
        onDelete={handleDeleteAdmin}
      />
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAdmin}
      />
    </div>
  );
}
