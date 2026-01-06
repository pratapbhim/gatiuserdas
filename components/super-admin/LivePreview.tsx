'use client';

import React, { ReactNode } from 'react';
import { RefreshCw, Maximize2 } from 'lucide-react';

interface LivePreviewProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  title,
  children,
  isLoading = false,
  onRefresh,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full h-full max-w-6xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title} - Fullscreen Preview</h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">{children}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b">
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">Live Preview</p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              title="Refresh preview"
            >
              <RefreshCw size={18} />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading preview...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="max-w-2xl mx-auto">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};
