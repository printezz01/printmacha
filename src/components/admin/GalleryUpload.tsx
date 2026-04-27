"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";

interface GalleryImage {
  url: string;
  alt_text?: string;
}

interface GalleryUploadProps {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  bucket?: string;
  maxImages?: number;
}

export default function GalleryUpload({
  value = [],
  onChange,
  bucket = "product-images",
  maxImages = 8,
}: GalleryUploadProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const remaining = maxImages - value.length;

      if (remaining <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const toUpload = fileArr.slice(0, remaining);
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

      // Validate all files first
      for (const file of toUpload) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(`"${file.name}" is not a valid image type. Use JPG, PNG, or WEBP.`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" is too large. Max 5MB per image.`);
          return;
        }
      }

      setUploadingCount(toUpload.length);

      try {
        const uploaded: GalleryImage[] = [];

        for (const file of toUpload) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", bucket);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || `Failed to upload ${file.name}`);
          }

          uploaded.push({ url: data.url, alt_text: "" });
        }

        onChange([...value, ...uploaded]);
        toast.success(
          `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded!`
        );
      } catch (error: any) {
        toast.error(error.message || "Upload failed");
      } finally {
        setUploadingCount(0);
      }
    },
    [bucket, maxImages, onChange, value]
  );

  const handleRemove = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleUpload(files);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const isUploading = uploadingCount > 0;

  return (
    <div className="space-y-3">
      {/* Existing images grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {value.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-muted)] aspect-square"
            >
              <img
                src={img.url}
                alt={img.alt_text || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-accent)] text-white text-[10px] font-semibold rounded-full">
                  Featured
                </span>
              )}
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMoveUp(i)}
                    className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-xs font-bold hover:bg-gray-100"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMoveDown(i)}
                    className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-xs font-bold hover:bg-gray-100"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < maxImages && (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-[var(--color-accent)] bg-[var(--color-brand-orange-50)]"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-muted)]"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)] animate-spin" />
              <p className="text-sm font-medium">
                Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}...
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-[var(--color-text-muted)]" />
                <Upload className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-sm font-medium">
                Drop images here or click to upload
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                PNG, JPG, WEBP up to 5MB · {value.length}/{maxImages} images
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Tip */}
      {value.length > 0 && (
        <p className="text-xs text-[var(--color-text-muted)]">
          💡 First image is used as the featured/primary image. Hover to reorder or remove.
        </p>
      )}
    </div>
  );
}
