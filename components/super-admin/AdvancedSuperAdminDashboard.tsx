'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  History,
  RefreshCw,
  Search,
  Download,
  Calendar,
  Tag
} from 'lucide-react';

interface StatFrame {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  type: 'card' | 'chart' | 'table';
  icon?: string;
}

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  status?: string;
  service?: string;
  search?: string;
}

interface VersionItem {
  id: string;
  section: string;
  editor_name: string;
  change_description: string;
  created_at: string;
  is_active: boolean;
}

export default function AdvancedSuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState('food-orders');
  const [stats, setStats] = useState<StatFrame[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [data, setData] = useState<any[]>([]);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load stats based on active section
  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/super-admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: activeSection,
          filters
        })
      });
      const statsData = await response.json();
      
      // Transform API response to StatFrame format
      const frames = Object.entries(statsData).map(([key, value], index) => ({
        id: `stat-${index}`,
        label: key.replace(/([A-Z])/g, ' $1').trim(),
        value: typeof value === 'number' ? value : JSON.stringify(value),
        type: 'card' as const
      }));
      
      setStats(frames);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, [activeSection, filters]);

  // Load data for current section
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const tableMap: Record<string, string> = {
        'food-orders': 'orders',
        'parcel-bookings': 'parcel_bookings',
        'ride-bookings': 'ride_bookings',
        'payments': 'payments',
        'offers': 'offers',
        'banners': 'banners',
        'restaurants': 'restaurants'
      };

      const tableName = tableMap[activeSection] || activeSection;
      const query = new URLSearchParams({
        limit: '50',
        offset: '0',
        ...filters
      });

      const response = await fetch(`/api/super-admin/crud/${tableName}?${query}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeSection, filters]);

  // Load versions
  const loadVersions = useCallback(async () => {
    try {
      const response = await fetch(`/api/super-admin/versions?section=${activeSection}`);
      const result = await response.json();
      setVersions(result.versions || []);
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  }, [activeSection]);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadData();
    loadVersions();
  }, [activeSection, filters, loadStats, loadData, loadVersions]);

  // Handle create
  const handleCreate = async (newItem: any) => {
    const tableMap: Record<string, string> = {
      'food-orders': 'orders',
      'parcel-bookings': 'parcel_bookings',
      'ride-bookings': 'ride_bookings',
      'payments': 'payments',
      'offers': 'offers',
      'banners': 'banners',
      'restaurants': 'restaurants'
    };

    const tableName = tableMap[activeSection];
    try {
      const response = await fetch(`/api/super-admin/crud/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const created = await response.json();
      setData([...data, created]);
      alert('✅ Created successfully!');
    } catch (error) {
      alert('❌ Failed to create');
      console.error(error);
    }
  };

  // Handle update
  const handleUpdate = async (item: any) => {
    const tableMap: Record<string, string> = {
      'food-orders': 'orders',
      'parcel-bookings': 'parcel_bookings',
      'ride-bookings': 'ride_bookings',
      'payments': 'payments',
      'offers': 'offers',
      'banners': 'banners',
      'restaurants': 'restaurants'
    };

    const tableName = tableMap[activeSection];
    try {
      const response = await fetch(`/api/super-admin/crud/${tableName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const updated = await response.json();
      setData(data.map(d => d.id === item.id ? updated : d));
      setEditingItem(null);
      alert('✅ Updated successfully!');
    } catch (error) {
      alert('❌ Failed to update');
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const tableMap: Record<string, string> = {
      'food-orders': 'orders',
      'parcel-bookings': 'parcel_bookings',
      'ride-bookings': 'ride_bookings',
      'payments': 'payments',
      'offers': 'offers',
      'banners': 'banners',
      'restaurants': 'restaurants'
    };

    const tableName = tableMap[activeSection];
    try {
      await fetch(`/api/super-admin/crud/${tableName}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setData(data.filter(d => d.id !== id));
      alert('✅ Deleted successfully!');
    } catch (error) {
      alert('❌ Failed to delete');
      console.error(error);
    }
  };

  // Handle restore version
  const handleRestoreVersion = async (version: VersionItem) => {
    try {
      const response = await fetch('/api/super-admin/versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: version.id,
          section: activeSection
        })
      });
      const result = await response.json();
      if (result.success) {
        loadVersions();
        loadStats();
        loadData();
        alert('✅ Version restored successfully!');
      }
    } catch (error) {
      alert('❌ Failed to restore version');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c1a] via-[#1a1a2e] to-[#121230]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0c0c1a]/95 backdrop-blur border-b border-[#2a2a4e] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#16c2a5]" />
            <h1 className="text-2xl font-bold text-white">Advanced Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="p-2 bg-[#16c2a5]/20 hover:bg-[#16c2a5]/30 text-[#16c2a5] rounded-lg transition-all"
              title="Version History"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="p-2 bg-[#16c2a5]/20 hover:bg-[#16c2a5]/30 text-[#16c2a5] rounded-lg transition-all"
              title="Live Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => { loadStats(); loadData(); }}
              className="p-2 bg-[#16c2a5]/20 hover:bg-[#16c2a5]/30 text-[#16c2a5] rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Navigation */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              <Tag className="w-4 h-4 inline mr-2 text-[#16c2a5]" />
              Select Section
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'food-orders', label: '🍔 Food Orders' },
                { id: 'parcel-bookings', label: '📦 Parcel Bookings' },
                { id: 'ride-bookings', label: '🚗 Ride Bookings' },
                { id: 'payments', label: '💳 Payments' },
                { id: 'offers', label: '🎁 Offers & Discounts' },
                { id: 'banners', label: '🖼️ Banners' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? 'bg-[#16c2a5] text-white shadow-lg shadow-[#16c2a5]/50'
                      : 'bg-[#0f0f1e] text-[#b0b0d0] hover:bg-[#2a2a4e]'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#16c2a5]" />
                Context-Aware Stats
              </h3>
              {loading && <div className="animate-spin">⟳</div>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map(stat => (
                <div key={stat.id} className="bg-[#0f0f1e] rounded-lg p-4 border border-[#2a2a4e]">
                  <p className="text-xs text-[#b0b0d0] mb-1 uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  {stat.change !== undefined && (
                    <p className={`text-xs mt-2 ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#16c2a5]" />
              Advanced Filters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-3 py-2 bg-[#0f0f1e] border border-[#2a2a4e] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#16c2a5]"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-3 py-2 bg-[#0f0f1e] border border-[#2a2a4e] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#16c2a5]"
                placeholder="End Date"
              />
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 bg-[#0f0f1e] border border-[#2a2a4e] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#16c2a5]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.service || ''}
                onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                className="px-3 py-2 bg-[#0f0f1e] border border-[#2a2a4e] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#16c2a5]"
              >
                <option value="">All Services</option>
                <option value="food">Food</option>
                <option value="parcel">Parcel</option>
                <option value="ride">Ride</option>
              </select>
            </div>
          </div>

          {/* Data Table with CRUD */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Data Management</h3>
              <button
                onClick={() => setEditingItem({})}
                className="flex items-center gap-2 px-4 py-2 bg-[#16c2a5] text-white rounded-lg hover:bg-[#14a892] transition-all font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Create New
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a9e]" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f1e] border border-[#2a2a4e] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#16c2a5]"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a4e]">
                    {Object.keys(data[0] || {}).slice(0, 5).map(key => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-semibold text-[#b0b0d0] uppercase">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#b0b0d0] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id} className="border-b border-[#2a2a4e] hover:bg-[#0f0f1e]/50">
                      {Object.entries(item).slice(0, 5).map(([key, value]: [string, any]) => (
                        <td key={key} className="px-4 py-2 text-white text-sm">
                          {typeof value === 'object' ? JSON.stringify(value).substring(0, 30) : String(value).substring(0, 30)}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-[#16c2a5] hover:text-[#14a892] mr-3"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Live Preview & Version History */}
        <div className="space-y-6">
          {/* Live Preview Panel */}
          {showLivePreview && (
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6 sticky top-28">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#16c2a5]" />
                Live Preview
              </h3>
              <div className="bg-[#0f0f1e] rounded-lg p-4 min-h-[400px] border border-[#2a2a4e]">
                <p className="text-[#b0b0d0] text-sm mb-3">
                  📍 Currently Editing: <strong>{activeSection}</strong>
                </p>
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {editingItem ? (
                    <div>
                      <p className="text-white font-semibold mb-3">Edit Mode</p>
                      {Object.entries(editingItem).map(([key, value]: [string, any]) => (
                        <input
                          key={key}
                          type="text"
                          value={String(value)}
                          onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                          className="w-full mb-2 px-2 py-1 bg-[#1a1a2e] border border-[#2a2a4e] rounded text-white text-xs"
                          placeholder={key}
                        />
                      ))}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdate(editingItem)}
                          className="flex-1 px-3 py-2 bg-[#16c2a5] text-white rounded font-semibold text-xs hover:bg-[#14a892]"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex-1 px-3 py-2 bg-[#2a2a4e] text-white rounded font-semibold text-xs hover:bg-[#3a3a5e]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#7a7a9e] text-xs">Select an item to preview changes</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Version History Panel */}
          {showVersionHistory && (
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-[#16c2a5]" />
                Version History
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {versions.length > 0 ? (
                  versions.map(version => (
                    <div key={version.id} className={`p-3 rounded-lg border ${
                      version.is_active ? 'border-[#16c2a5] bg-[#16c2a5]/10' : 'border-[#2a2a4e] bg-[#0f0f1e]'
                    }`}>
                      <p className="text-white font-semibold text-sm">{version.editor_name}</p>
                      <p className="text-[#b0b0d0] text-xs">{version.change_description}</p>
                      <p className="text-[#7a7a9e] text-xs mt-1">
                        {new Date(version.created_at).toLocaleString()}
                      </p>
                      {!version.is_active && (
                        <button
                          onClick={() => handleRestoreVersion(version)}
                          className="mt-2 w-full px-2 py-1 bg-[#16c2a5]/20 text-[#16c2a5] rounded text-xs font-semibold hover:bg-[#16c2a5]/30 transition-all flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Restore This Version
                        </button>
                      )}
                      {version.is_active && (
                        <p className="mt-2 text-center text-[#16c2a5] text-xs font-semibold">✓ Active</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[#7a7a9e] text-sm">No version history yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
