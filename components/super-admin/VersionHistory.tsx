'use client';

import React, { useState } from 'react';
import { History, RotateCcw, Calendar } from 'lucide-react';

interface Revision {
  id: string;
  authorId: string;
  author: {
    name: string;
    email: string;
  };
  changeNote: string;
  createdAt: string;
}

interface VersionHistoryProps {
  pageId: string;
  revisions: Revision[];
  onRollback: (revisionId: string) => Promise<void>;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  pageId,
  revisions,
  onRollback,
}) => {
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(
    revisions[0]?.id || null
  );
  const [rolling, setRolling] = useState(false);

  const selectedRevision = revisions.find((r) => r.id === selectedRevisionId);

  const handleRollback = async () => {
    if (!selectedRevisionId) return;
    if (
      !confirm(
        'Are you sure you want to rollback to this version? This action cannot be undone.'
      )
    ) {
      return;
    }

    setRolling(true);
    try {
      await onRollback(selectedRevisionId);
      alert('Rolled back successfully!');
    } catch (error) {
      alert('Failed to rollback');
      console.error(error);
    } finally {
      setRolling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <History size={20} />
          Version History
        </h3>
      </div>

      <div className="grid grid-cols-3 h-96">
        {/* Revisions List */}
        <div className="border-r border-gray-200 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {revisions.map((revision, idx) => (
              <button
                key={revision.id}
                onClick={() => setSelectedRevisionId(revision.id)}
                className={`w-full p-4 text-left transition-colors ${
                  selectedRevisionId === revision.id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {idx === 0 ? 'Current' : `Version ${revisions.length - idx}`}
                  </span>
                  {idx === 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {revision.changeNote || 'No change note'}
                </p>
                <p className="text-xs text-gray-500">
                  by {revision.author?.name || 'Unknown'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Revision Details */}
        {selectedRevision && (
          <div className="col-span-2 p-6 flex flex-col">
            <div className="flex-1 mb-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Author</h4>
                <p className="text-sm text-gray-600">
                  {selectedRevision.author?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRevision.author?.email}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Published Date
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedRevision.createdAt)}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Change Note
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedRevision.changeNote || 'No change note provided'}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleRollback}
                disabled={rolling}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                <RotateCcw size={18} />
                {rolling ? 'Rolling Back...' : 'Rollback to This Version'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                This will restore the page to this version
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
