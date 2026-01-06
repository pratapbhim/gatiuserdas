'use client';

import React, { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';

interface Settings {
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  metaTitle: string;
  metaDescription: string;
  supportEmail: string;
  supportPhone: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'seo' | 'contact'>('branding');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/super-admin/settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateSetting = (key: keyof Settings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/super-admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminDashboard>
        <div className="p-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </SuperAdminDashboard>
    );
  }

  if (!settings) {
    return (
      <SuperAdminDashboard>
        <div className="p-8">
          <p className="text-gray-500">Failed to load settings</p>
        </div>
      </SuperAdminDashboard>
    );
  }

  const SettingInput = ({
    label,
    value,
    onChange,
    type = 'text',
    description,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    description?: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      ) : type === 'color' ? (
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  return (
    <SuperAdminDashboard>
      <div className="p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Global Settings
            </h2>
            <p className="text-gray-600">
              Configure platform-wide branding, theme, and settings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {['branding', 'theme', 'seo', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Branding Settings
                </h3>
                <SettingInput
                  label="Brand Name"
                  value={settings.brandName}
                  onChange={(v) => handleUpdateSetting('brandName', v)}
                  description="The name of your platform"
                />
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <div className="flex gap-3 items-end">
                      <input
                        type="text"
                        value={settings.logoUrl}
                        onChange={(e) =>
                          handleUpdateSetting('logoUrl', e.target.value)
                        }
                        placeholder="/img/logo.png"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                      <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload size={16} />
                        Upload
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload or provide URL to your logo
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon URL
                    </label>
                    <div className="flex gap-3 items-end">
                      <input
                        type="text"
                        value={settings.faviconUrl}
                        onChange={(e) =>
                          handleUpdateSetting('faviconUrl', e.target.value)
                        }
                        placeholder="/favicon.ico"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                      <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload size={16} />
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Theme Configuration
                </h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <SettingInput
                    label="Primary Color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(v) => handleUpdateSetting('primaryColor', v)}
                    description="Main brand color"
                  />
                  <SettingInput
                    label="Secondary Color"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(v) => handleUpdateSetting('secondaryColor', v)}
                    description="Secondary brand color"
                  />
                  <SettingInput
                    label="Accent Color"
                    type="color"
                    value={settings.accentColor}
                    onChange={(v) => handleUpdateSetting('accentColor', v)}
                    description="Accent and highlight color"
                  />
                  <SettingInput
                    label="Background Color"
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(v) => handleUpdateSetting('backgroundColor', v)}
                    description="Page background color"
                  />
                  <SettingInput
                    label="Text Color"
                    type="color"
                    value={settings.textColor}
                    onChange={(v) => handleUpdateSetting('textColor', v)}
                    description="Primary text color"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  SEO Settings
                </h3>
                <SettingInput
                  label="Meta Title"
                  value={settings.metaTitle}
                  onChange={(v) => handleUpdateSetting('metaTitle', v)}
                  description="Default page title for search engines"
                />
                <SettingInput
                  label="Meta Description"
                  type="textarea"
                  value={settings.metaDescription}
                  onChange={(v) =>
                    handleUpdateSetting('metaDescription', v)
                  }
                  description="Default page description (recommended: 155-160 characters)"
                />
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <SettingInput
                  label="Support Email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(v) => handleUpdateSetting('supportEmail', v)}
                  description="Primary support email address"
                />
                <SettingInput
                  label="Support Phone"
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(v) => handleUpdateSetting('supportPhone', v)}
                  description="Primary support phone number"
                />
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex gap-4 pt-8 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
