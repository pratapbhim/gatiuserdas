'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Step extends SectionData {
  id: string;
}

export default function BookingFlowPage() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'step-1',
      type: 'Step',
      title: 'Enter Details',
      description: 'Provide pickup and delivery addresses',
      visible: true,
    },
    {
      id: 'step-2',
      type: 'Step',
      title: 'Select Service',
      description: 'Choose delivery speed and options',
      visible: true,
    },
    {
      id: 'step-3',
      type: 'Step',
      title: 'Confirm & Pay',
      description: 'Review and complete payment',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Step) => {
    setSteps(steps.map((s) => (s.id === id ? updated : s)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setSteps(steps.filter((s) => s.id !== id));
    }
  };

  const handleAdd = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      type: 'Step',
      title: 'New Step',
      description: 'Step description',
      visible: true,
    };
    setSteps([...steps, newStep]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Flow Steps
              </h1>
              <p className="text-gray-600">Manage the parcel booking process steps</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Step
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((s) => (
              <SectionEditor
                key={s.id}
                section={s}
                onUpdate={(u) => handleUpdate(s.id, u as Step)}
                onDelete={() => handleDelete(s.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Booking Flow Preview">
            <div className="space-y-4">
              {steps.filter(s => s.visible).map((s, idx) => (
                <div key={s.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-1 h-12 bg-blue-200"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.description}</p>
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
