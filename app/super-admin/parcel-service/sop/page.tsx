'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface SOPItem extends SectionData {
  id: string;
}

export default function SOPPage() {
  const [items, setItems] = useState<SOPItem[]>([
    {
      id: 'sop-1',
      type: 'SOP',
      title: 'Packaging Requirements',
      content: 'All parcels must be securely packaged. Use boxes, envelopes, or padded bags.',
      visible: true,
    },
    {
      id: 'sop-2',
      type: 'SOP',
      title: 'Size Restrictions',
      content: 'Maximum dimensions: 60cm x 40cm x 40cm. Maximum weight: 25kg.',
      visible: true,
    },
    {
      id: 'sop-3',
      type: 'SOP',
      title: 'Prohibited Items',
      content: 'No hazardous materials, perishables (without special handling), or valuables.',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: SOPItem) => {
    setItems(items.map((i) => (i.id === id ? updated : i)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleAdd = () => {
    const newItem: SOPItem = {
      id: `sop-${Date.now()}`,
      type: 'SOP',
      title: 'New Procedure',
      content: 'Procedure description',
      visible: true,
    };
    setItems([...items, newItem]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                SOP - Standard Operating Procedures
              </h1>
              <p className="text-gray-600">Manage parcel handling guidelines</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Procedure
            </button>
          </div>

          <div className="space-y-4">
            {items.map((i) => (
              <SectionEditor
                key={i.id}
                section={i}
                onUpdate={(u) => handleUpdate(i.id, u as SOPItem)}
                onDelete={() => handleDelete(i.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="SOP Preview">
            <div className="space-y-6">
              {items.filter(i => i.visible).map((i, idx) => (
                <div key={i.id}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{i.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{i.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
