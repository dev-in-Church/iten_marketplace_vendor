"use client";

import { useState, useRef } from "react";
import { Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  label = "Product Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setPreview(data.secure_url);
      onImageUpload(data.secure_url);
    } catch (err) {
      console.error("[v0] Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }
      uploadToCloudinary(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToCloudinary(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 bg-secondary/50">
          <div className="flex flex-col gap-3">
            {/* File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Choose from Device"}
              </Button>
            </div>

            {/* Camera Capture */}
            <div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading}
                className="w-full gap-2"
              >
                <Camera className="h-4 w-4" />
                {uploading ? "Uploading..." : "Take a Photo"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Info */}
      {!preview && (
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP. Max size: 5MB
        </p>
      )}
    </div>
  );
}
