'use client';

import React, { useState } from 'react';
import { Save, Eye, EyeOff, Copy, Trash2, ChevronDown } from 'lucide-react';

export interface SectionData {
  id: string;
  type: string;
  title?: string;
  heading?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
  content?: string;
  visible?: boolean;
  order?: number;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: any;
}

interface SectionEditorProps {
  section: SectionData;
  onUpdate: (section: SectionData) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showPreview?: boolean;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onDelete,
  onDuplicate,
  showPreview = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localSection, setLocalSection] = useState(section);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setLocalSection({ ...localSection, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onUpdate(localSection);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = () => {
    handleFieldChange('visible', !localSection.visible);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
        <div
          className="flex-1 cursor-pointer flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            size={20}
            className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {localSection.heading || localSection.title || localSection.type}
            </h3>
            <p className="text-xs text-gray-500">{localSection.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleVisibility}
            className={`p-2 rounded-lg transition-colors ${
              localSection.visible
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
            title={localSection.visible ? 'Hide section' : 'Show section'}
          >
            {localSection.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              title="Duplicate section"
            >
              <Copy size={18} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              title="Delete section"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-4">
          {/* Title Field */}
          {(localSection.title || localSection.heading) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {localSection.title ? 'Title' : 'Heading'}
              </label>
              <input
                type="text"
                value={localSection.title || localSection.heading || ''}
                onChange={(e) =>
                  handleFieldChange(
                    localSection.title ? 'title' : 'heading',
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter title"
              />
            </div>
          )}

          {/* Subtitle/Description Field */}
          {(localSection.subtitle || localSection.description) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {localSection.subtitle ? 'Subtitle' : 'Description'}
              </label>
              <textarea
                value={localSection.subtitle || localSection.description || ''}
                onChange={(e) =>
                  handleFieldChange(
                    localSection.subtitle ? 'subtitle' : 'description',
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Enter description"
              />
            </div>
          )}

          {/* Content Field */}
          {localSection.content && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={localSection.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Enter content"
              />
            </div>
          )}

          {/* Image URL Field */}
          {localSection.imageUrl !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={localSection.imageUrl}
                onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              {localSection.imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={localSection.imageUrl}
                    alt={localSection.imageAlt || 'Section image'}
                    className="w-full max-h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Image Alt Text */}
          {localSection.imageAlt !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                value={localSection.imageAlt}
                onChange={(e) => handleFieldChange('imageAlt', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alt text for accessibility"
              />
            </div>
          )}

          {/* Button Text & Link */}
          {localSection.buttonText !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={localSection.buttonText}
                  onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={localSection.buttonLink || ''}
                  onChange={(e) => handleFieldChange('buttonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., /restaurants"
                />
              </div>
            </div>
          )}

          {/* Color Fields */}
          {localSection.backgroundColor !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localSection.backgroundColor}
                    onChange={(e) =>
                      handleFieldChange('backgroundColor', e.target.value)
                    }
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSection.backgroundColor}
                    onChange={(e) =>
                      handleFieldChange('backgroundColor', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              {localSection.textColor !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localSection.textColor}
                      onChange={(e) =>
                        handleFieldChange('textColor', e.target.value)
                      }
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSection.textColor}
                      onChange={(e) =>
                        handleFieldChange('textColor', e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
