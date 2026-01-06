'use client';

import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface SectionData {
  id: string;
  type: string;
  title?: string;
  description?: string;
  order: number;
  visible: boolean;
  props: Record<string, any>;
}

interface PageEditorProps {
  pageId: string;
  pageTitle: string;
  sections: SectionData[];
  onSave: (sections: SectionData[]) => Promise<void>;
  onPublish: () => Promise<void>;
}

const sectionTypes = [
  { id: 'hero', name: 'Hero Section', icon: '🎯' },
  { id: 'banner', name: 'Banner', icon: '📢' },
  { id: 'cards', name: 'Cards Grid', icon: '📇' },
  { id: 'content', name: 'Content Block', icon: '📝' },
  { id: 'pricing', name: 'Pricing Table', icon: '💰' },
  { id: 'testimonials', name: 'Testimonials', icon: '⭐' },
  { id: 'cta', name: 'Call to Action', icon: '🎁' },
  { id: 'form', name: 'Form', icon: '📋' },
];

export const PageEditor: React.FC<PageEditorProps> = ({
  pageId,
  pageTitle,
  sections: initialSections,
  onSave,
  onPublish,
}) => {
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialSections[0]?.id || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const handleAddSection = (type: string) => {
    const newSection: SectionData = {
      id: `sec-${Date.now()}`,
      type,
      title: `New ${type} Section`,
      order: sections.length,
      visible: true,
      props: {},
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    setShowAddModal(false);
  };

  const handleUpdateSection = (updatedData: Partial<SectionData>) => {
    if (!selectedSectionId) return;
    setSections(
      sections.map((s) =>
        s.id === selectedSectionId ? { ...s, ...updatedData } : s
      )
    );
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(sections[0]?.id || null);
    }
  };

  const handleReorderSection = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((s) => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSections[currentIndex], newSections[swapIndex]] = [
      newSections[swapIndex],
      newSections[currentIndex],
    ];

    // Update order values
    newSections.forEach((s, idx) => {
      s.order = idx;
    });

    setSections(newSections);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(sections);
      alert('Page saved successfully!');
    } catch (error) {
      alert('Failed to save page');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this page?')) return;

    setIsPublishing(true);
    try {
      await onPublish();
      alert('Page published successfully!');
    } catch (error) {
      alert('Failed to publish page');
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar - Section List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Page Sections</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Section
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedSectionId === section.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedSectionId(section.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {section.title || `Untitled ${section.type}`}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">{section.type}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateSection({
                      visible: !section.visible,
                    });
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title={section.visible ? 'Hide section' : 'Show section'}
                >
                  {section.visible ? (
                    <Eye size={16} className="text-green-600" />
                  ) : (
                    <EyeOff size={16} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReorderSection(section.id, 'up');
                  }}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReorderSection(section.id, 'down');
                  }}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(section.id);
                  }}
                  className="ml-auto text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">
        {selectedSection ? (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Section
            </h2>

            {/* Section Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={selectedSection.title || ''}
                onChange={(e) =>
                  handleUpdateSection({ title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Section Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={selectedSection.description || ''}
                onChange={(e) =>
                  handleUpdateSection({ description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Section Type Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Section Type: {selectedSection.type}
              </h4>
              <p className="text-sm text-blue-800">
                Configure this {selectedSection.type} section's content and
                properties below.
              </p>
            </div>

            {/* Dynamic Properties Editor */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Section Properties
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-sm text-gray-600 font-mono overflow-auto">
                  {JSON.stringify(selectedSection.props, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: Advanced property editing requires a more sophisticated editor.
                This is a preview of the current JSON data.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No section selected</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add First Section
            </button>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Section
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {sectionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleAddSection(type.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <p className="text-sm font-medium text-gray-900">
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
