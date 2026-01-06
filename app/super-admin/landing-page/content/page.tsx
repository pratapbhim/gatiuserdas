'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface ContentBlock extends SectionData {
  id: string;
}

export default function ContentPage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: 'content-1',
      type: 'Content Block',
      heading: 'How It Works',
      content: 'Our platform makes it easy to order food, book rides, and send parcels all in one place.',
      visible: true,
    },
    {
      id: 'content-2',
      type: 'Content Block',
      heading: 'Why Choose Us?',
      content: 'We offer the best prices, fastest delivery, and highest quality service in the industry.',
      visible: true,
    },
  ]);

  const handleUpdateBlock = (id: string, updated: ContentBlock) => {
    setContentBlocks(contentBlocks.map((b) => (b.id === id ? updated : b)));
  };

  const handleDeleteBlock = (id: string) => {
    if (confirm('Are you sure you want to delete this content block?')) {
      setContentBlocks(contentBlocks.filter((b) => b.id !== id));
    }
  };

  const handleAddBlock = () => {
    const newBlock: ContentBlock = {
      id: `content-${Date.now()}`,
      type: 'Content Block',
      heading: 'New Content Block',
      content: 'Enter your content here',
      visible: true,
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        {/* Editor */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Content Blocks
              </h1>
              <p className="text-gray-600">
                Manage text content blocks on landing page
              </p>
            </div>
            <button
              onClick={handleAddBlock}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Block
            </button>
          </div>

          <div className="space-y-4">
            {contentBlocks.map((block) => (
              <SectionEditor
                key={block.id}
                section={block}
                onUpdate={(updated) => handleUpdateBlock(block.id, updated as ContentBlock)}
                onDelete={() => handleDeleteBlock(block.id)}
              />
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-96 hidden lg:block">
          <LivePreview title="Content Preview">
            <div className="space-y-8">
              {contentBlocks.filter(b => b.visible).map((block) => (
                <div key={block.id} className="border-l-4 border-blue-600 pl-4">
                  <h2 className="text-2xl font-bold mb-3">{block.heading}</h2>
                  <p className="text-gray-700 leading-relaxed">{block.content}</p>
                </div>
              ))}
            </div>
          </LivePreview>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
