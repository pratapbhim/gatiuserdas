'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Component extends SectionData {
  id: string;
}

export default function OrderPagePage() {
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'comp-1',
      type: 'Component',
      title: 'Order Filters',
      description: 'Filter options for orders',
      visible: true,
    },
    {
      id: 'comp-2',
      type: 'Component',
      title: 'Search Bar',
      description: 'Search restaurants and dishes',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Component) => {
    setComponents(components.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  const handleAdd = () => {
    const newComp: Component = {
      id: `comp-${Date.now()}`,
      type: 'Component',
      title: 'New Component',
      description: 'Component description',
      visible: true,
    };
    setComponents([...components, newComp]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Page Components
              </h1>
              <p className="text-gray-600">Manage order page layout</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Component
            </button>
          </div>

          <div className="space-y-4">
            {components.map((c) => (
              <SectionEditor
                key={c.id}
                section={c}
                onUpdate={(u) => handleUpdate(c.id, u as Component)}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Order Page Preview">
            <div className="space-y-4">
              {components.filter(c => c.visible).map((c) => (
                <div key={c.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
