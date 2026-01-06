'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus, AlertCircle } from 'lucide-react';

interface Warning extends SectionData {
  id: string;
}

export default function WarningsPage() {
  const [warnings, setWarnings] = useState<Warning[]>([
    {
      id: 'warn-1',
      type: 'Warning',
      title: 'Handle With Care',
      content: 'Fragile items must be clearly labeled and securely packaged',
      visible: true,
    },
    {
      id: 'warn-2',
      type: 'Warning',
      title: 'No Liquids or Gels',
      content: 'Cannot ship liquids, gels, or items that may leak',
      visible: true,
    },
    {
      id: 'warn-3',
      type: 'Warning',
      title: 'Verify Contents',
      content: 'Make sure to verify parcel contents before sealing the package',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Warning) => {
    setWarnings(warnings.map((w) => (w.id === id ? updated : w)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setWarnings(warnings.filter((w) => w.id !== id));
    }
  };

  const handleAdd = () => {
    const newWarn: Warning = {
      id: `warn-${Date.now()}`,
      type: 'Warning',
      title: 'New Warning',
      content: 'Warning description',
      visible: true,
    };
    setWarnings([...warnings, newWarn]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Warnings & Alerts
              </h1>
              <p className="text-gray-600">Manage important warnings for parcel delivery</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Warning
            </button>
          </div>

          <div className="space-y-4">
            {warnings.map((w) => (
              <SectionEditor
                key={w.id}
                section={w}
                onUpdate={(u) => handleUpdate(w.id, u as Warning)}
                onDelete={() => handleDelete(w.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Warnings & Alerts Preview">
            <div className="space-y-3">
              {warnings.filter(w => w.visible).map((w) => (
                <div
                  key={w.id}
                  className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex gap-3"
                >
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-amber-900">{w.title}</h3>
                    <p className="text-sm text-amber-800">{w.content}</p>
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
