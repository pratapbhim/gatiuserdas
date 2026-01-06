'use client';

import React, { useState } from 'react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { SectionEditor, SectionData } from '@/components/super-admin/SectionEditor';
import { LivePreview } from '@/components/super-admin/LivePreview';
import { Plus } from 'lucide-react';

interface Category extends SectionData {
  id: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat-1',
      type: 'Category',
      title: 'North Indian',
      imageUrl: '/img/north-indian.jpg',
      description: 'Authentic North Indian cuisine',
      visible: true,
    },
    {
      id: 'cat-2',
      type: 'Category',
      title: 'South Indian',
      imageUrl: '/img/south-indian.jpg',
      description: 'Traditional South Indian dishes',
      visible: true,
    },
    {
      id: 'cat-3',
      type: 'Category',
      title: 'Chinese',
      imageUrl: '/img/chinese.jpg',
      description: 'Delicious Chinese food',
      visible: true,
    },
  ]);

  const handleUpdate = (id: string, updated: Category) => {
    setCategories(categories.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleAdd = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      type: 'Category',
      title: 'New Category',
      imageUrl: '',
      description: 'Category description',
      visible: true,
    };
    setCategories([...categories, newCat]);
  };

  return (
    <SuperAdminDashboard>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Food Categories
              </h1>
              <p className="text-gray-600">Manage food service categories</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((c) => (
              <SectionEditor
                key={c.id}
                section={c}
                onUpdate={(u) => handleUpdate(c.id, u as Category)}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <LivePreview title="Categories Preview">
            <div className="grid grid-cols-2 gap-4">
              {categories.filter(c => c.visible).map((c) => (
                <div key={c.id} className="border rounded-lg overflow-hidden text-center">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">{c.title}</h3>
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
