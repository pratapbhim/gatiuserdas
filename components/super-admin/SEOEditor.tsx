'use client';

import React, { useState } from 'react';
import { Search, BarChart3 } from 'lucide-react';

interface SEOSettings {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
}

interface SEOEditorProps {
  pageId: string;
  settings: SEOSettings;
  onSave: (settings: SEOSettings) => Promise<void>;
}

export const SEOEditor: React.FC<SEOEditorProps> = ({
  pageId,
  settings: initialSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState<SEOSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const titleLength = settings.seoTitle.length;
  const descriptionLength = settings.seoDescription.length;

  const isTitleGood = titleLength >= 30 && titleLength <= 60;
  const isDescriptionGood =
    descriptionLength >= 120 && descriptionLength <= 160;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(settings);
      alert('SEO settings saved!');
    } catch (error) {
      alert('Failed to save SEO settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BarChart3 size={20} className="text-blue-600" />
          SEO Settings
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Optimize this page for search engines
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={settings.seoTitle}
            onChange={(e) =>
              setSettings({ ...settings, seoTitle: e.target.value })
            }
            placeholder="Your page title for search engines"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {titleLength} / 60 characters
            </p>
            <span
              className={`text-xs px-2 py-1 rounded ${
                isTitleGood
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isTitleGood ? '✓ Good' : 'Optimize'}
            </span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isTitleGood ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={settings.seoDescription}
            onChange={(e) =>
              setSettings({ ...settings, seoDescription: e.target.value })
            }
            placeholder="Brief description of your page content (155-160 characters recommended)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {descriptionLength} / 160 characters
            </p>
            <span
              className={`text-xs px-2 py-1 rounded ${
                isDescriptionGood
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isDescriptionGood ? '✓ Good' : 'Optimize'}
            </span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isDescriptionGood ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{
                width: `${Math.min((descriptionLength / 160) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          <input
            type="text"
            value={settings.seoKeywords}
            onChange={(e) =>
              setSettings({ ...settings, seoKeywords: e.target.value })
            }
            placeholder="food delivery, restaurants, online ordering (comma-separated)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <p className="text-xs text-gray-600 mt-2">
            Separate keywords with commas
          </p>
        </div>

        {/* OG Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open Graph Image (OG Image)
          </label>
          <input
            type="text"
            value={settings.ogImage}
            onChange={(e) =>
              setSettings({ ...settings, ogImage: e.target.value })
            }
            placeholder="/img/og-image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <p className="text-xs text-gray-600 mt-2">
            Image displayed when shared on social media (1200x630px recommended)
          </p>
          {settings.ogImage && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <img
                src={settings.ogImage}
                alt="OG Preview"
                className="w-full max-h-48 object-cover rounded"
                onError={() => {
                  /* Image failed to load */
                }}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            Search Results Preview
          </h4>
          <div className="bg-white rounded border border-gray-300 p-3">
            <h5 className="text-blue-600 font-medium text-sm mb-1">
              {settings.seoTitle || 'Your Page Title'}
            </h5>
            <p className="text-xs text-green-700 mb-1">
              https://userdash.com/page
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {settings.seoDescription ||
                'Your page description appears here...'}
            </p>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Search size={18} />
            SEO Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Title: 30-60 characters (current: {titleLength})</li>
            <li>
              ✓ Description: 120-160 characters (current: {descriptionLength})
            </li>
            <li>✓ Use relevant keywords naturally</li>
            <li>✓ Include your brand name in the title</li>
            <li>✓ Make description compelling and click-worthy</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
