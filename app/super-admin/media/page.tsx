'use client';

import React, { useEffect, useState } from 'react';
import { Upload, Trash2, Copy, Download } from 'lucide-react';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';

interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  createdAt: string;
}

export default function MediaManagerPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const fetchMedia = async () => {
    try {
      const response = await fetch(
        `/api/super-admin/media?page=${page}&limit=20`
      );
      const data = await response.json();
      setMedia(data.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/super-admin/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          fetchMedia();
        }
      }
    } catch (error) {
      alert('Failed to upload files');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const response = await fetch(`/api/super-admin/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMedia(media.filter((m) => m.id !== id));
      }
    } catch (error) {
      alert('Failed to delete media');
      console.error(error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const filteredMedia = media.filter((m) =>
    m.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

  return (
    <SuperAdminDashboard>
      <div className="p-8">
        <div className="max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Media Manager
            </h2>
            <p className="text-gray-600">
              Upload and manage images and other media files
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center mb-8">
            <div className="flex justify-center mb-4">
              <Upload size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag and drop images here
            </h3>
            <p className="text-gray-600 mb-6">
              or click the button below to select files
            </p>
            <label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                onClick={(e) =>
                  (e.currentTarget.parentElement?.querySelector(
                    'input'
                  ) as HTMLInputElement)?.click()
                }
                disabled={uploading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Uploading...' : 'Select Files'}
              </button>
            </label>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Media Grid */}
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item.id)}
                  className={`bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-colors ${
                    selectedMedia === item.id
                      ? 'border-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {item.mimeType.startsWith('image/') && (
                    <img
                      src={item.url}
                      alt={item.fileName}
                      className="w-full h-40 object-cover bg-gray-100"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 truncate mb-1">
                      {item.fileName}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {formatFileSize(item.size)}
                      {item.width && item.height && (
                        <span> • {item.width}x{item.height}</span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.url);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id);
                        }}
                        className="flex items-center justify-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">
                {searchTerm ? 'No media files match your search' : 'No media files uploaded yet'}
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-default"
            >
              Page {page}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </SuperAdminDashboard>
  );
}
