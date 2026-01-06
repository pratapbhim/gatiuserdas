'use client';

import React, { useEffect, useState } from 'react';
import { PageEditor } from '@/components/super-admin/PageEditor';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  sections: any[];
}

export default function RideServiceManagementPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/super-admin/pages?service=RIDE');
        const data = await response.json();
        setPages(data.pages);
        if (data.pages.length > 0) {
          setSelectedPageId(data.pages[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const selectedPage = pages.find((p) => p.id === selectedPageId);

  const handleSavePage = async (sections: any[]) => {
    if (!selectedPageId) return;
    const response = await fetch(`/api/super-admin/pages/${selectedPageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    return response.json();
  };

  const handlePublishPage = async () => {
    if (!selectedPageId) return;
    const response = await fetch(
      `/api/super-admin/pages/${selectedPageId}/publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.json();
  };

  if (loading) {
    return (
      <SuperAdminDashboard>
        <div className="p-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </SuperAdminDashboard>
    );
  }

  if (!selectedPage) {
    return (
      <SuperAdminDashboard>
        <div className="p-8">
          <p className="text-gray-500">No pages found</p>
        </div>
      </SuperAdminDashboard>
    );
  }

  return (
    <SuperAdminDashboard>
      <div className="h-full">
        <div className="p-8 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ride Service Management
          </h2>
          <div className="flex gap-2 mb-4">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageId(page.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPageId === page.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
        <PageEditor
          pageId={selectedPage.id}
          pageTitle={selectedPage.title}
          sections={selectedPage.sections || []}
          onSave={handleSavePage}
          onPublish={handlePublishPage}
        />
      </div>
    </SuperAdminDashboard>
  );
}
