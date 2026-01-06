'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface PricingRule extends SectionData {
  id: string;
}

export default function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: 'rule-1',
      type: 'Rule',
      title: 'Standard Delivery',
      description: '₹50 for first 5km, ₹5 per additional km',
      visible: true,
    },
    {
      id: 'rule-2',
      type: 'Rule',
      title: 'Express Delivery',
      description: '₹100 for first 5km, ₹10 per additional km',
      visible: true,
    },
    {
      id: 'rule-3',
      type: 'Rule',
      title: 'Weight Surcharge',
      description: 'Additional ₹10 per 500g above 2kg',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: PricingRule) => {
    setRules(rules.map((r) => (r.id === id ? updated : r)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const handleAdd = () => {
    const newRule: PricingRule = {
      id: `rule-${Date.now()}`,
      type: 'Rule',
      title: 'New Rule',
      description: 'Rule description',
      visible: true,
    };
    setRules([...rules, newRule]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pricing & Rules
              </h1>
              <p className="text-gray-600">Manage parcel pricing and delivery rules</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {rules.map((r) => (
              <SectionEditor
                key={r.id}
                section={r}
                onUpdate={(u) => handleUpdate(r.id, u as PricingRule)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Pricing & Rules Preview">
            <div className="space-y-3">
              {rules.filter(r => r.visible).map((r) => (
                <div key={r.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900">{r.title}</h3>
                  <p className="text-sm text-blue-700">{r.description}</p>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
