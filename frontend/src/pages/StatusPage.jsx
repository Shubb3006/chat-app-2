import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useStatusStore } from "../store/useStatusStore";
import { Camera, X } from "lucide-react";
import StatusSkeleton from "../components/skeletons/StatusSkeleton";

const StatusPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const { authUser } = useAuthStore();
  const { statuses, getStatuses, isLoading, isUploading, addStatus } =
    useStatusStore();

  useEffect(() => {
    getStatuses();
  }, []);

  const handleStatusUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImage(reader.result);
      await addStatus({ image: reader.result });
    };
  };

  if (isLoading) return <StatusSkeleton />;

  const selectedStatus = statuses.find(
    (status) => status._id === selectedStatusId
  );

  return (
    <div className="pt-20 bg-base-200 min-h-screen">
      {/* Status Row */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto">
        {/* My Status */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="relative">
            <img
              src={selectedImage || authUser.profilePic || "/avatar.png"}
              alt="My Status"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
            />

            <label
              htmlFor="status-upload"
              className={`absolute bottom-0 right-0 bg-primary p-1.5 rounded-full cursor-pointer
              ${isUploading ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="w-4 h-4 text-white" />
              <input
                id="status-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleStatusUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          <span className="text-xs mt-2 text-center">
            {isUploading ? "Uploading..." : "My Status"}
          </span>
        </div>

        {/* Other Users Status */}
        {statuses.map((status) => (
          <button
            key={status._id}
            className="flex flex-col items-center hover:cursor-pointer"
            onClick={() => setSelectedStatusId(status._id)}
          >
            <img
              src={status.image || status.userId?.profilePic || "/avatar.png"}
              alt="status"
              className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
            />
            <span className="text-xs mt-2 text-center truncate w-20">
              {status.userId?.fullName || "User"}
            </span>
          </button>
        ))}
      </div>

      {selectedStatus && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <img
            src={selectedStatus.image}
            className="max-w-full max-h-full object-contain"
          />

          <button
            onClick={() => setSelectedStatusId(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={28} className="hover:cursor-pointer" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
