'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface PricingBlock extends SectionData {
  id: string;
}

export default function PricingPage() {
  const [blocks, setBlocks] = useState<PricingBlock[]>([
    {
      id: 'pricing-1',
      type: 'Pricing',
      title: 'Economy Ride',
      content: 'Budget-friendly option',
      visible: true,
    },
    {
      id: 'pricing-2',
      type: 'Pricing',
      title: 'Premium Ride',
      content: 'Comfort and luxury',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: PricingBlock) => {
    setBlocks(blocks.map((b) => (b.id === id ? updated : b)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setBlocks(blocks.filter((b) => b.id !== id));
    }
  };

  const handleAdd = () => {
    const newBlock: PricingBlock = {
      id: `pricing-${Date.now()}`,
      type: 'Pricing',
      title: 'New Plan',
      content: 'Plan description',
      visible: true,
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pricing Blocks
              </h1>
              <p className="text-gray-600">Manage pricing plans</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Plan
            </button>
          </div>

          <div className="space-y-4">
            {blocks.map((b) => (
              <SectionEditor
                key={b.id}
                section={b}
                onUpdate={(u) => handleUpdate(b.id, u as PricingBlock)}
                onDelete={() => handleDelete(b.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Pricing Preview">
            <div className="grid grid-cols-1 gap-4">
              {blocks.filter(b => b.visible).map((b) => (
                <div key={b.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm">{b.content}</p>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
