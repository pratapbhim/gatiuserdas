import React, { useState } from "react";
import { X, Edit2, Trash2, Mail, Calendar } from "lucide-react";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at?: string;
}

interface AdminDetailModalProps {
  admin: Admin | null;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  admin,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    role: admin?.role || "ADMIN",
  });

  if (!admin) return null;

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(admin.id, formData);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(admin.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsLoading(true);
    try {
      await onUpdate(admin.id, { active: !admin.active });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Admin Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isEditing ? (
            <>
              {/* Display Mode */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{admin.name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <p className="text-sm text-gray-700">{admin.email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      admin.role === "SUPER_ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {admin.role}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      admin.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {admin.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} /> Created Date
                  </label>
                  <p className="text-sm text-gray-700">
                    {formatDate(admin.created_at)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit2 size={18} /> Edit
                </button>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="flex items-center justify-center gap-2 flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}

          {/* Delete Confirmation */}
          {isDeleting && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 mb-3">
                Are you sure you want to delete this admin? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
