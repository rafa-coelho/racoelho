"use client";
import { useState } from "react";

interface ImageUploadProps {
  image: File | null;
  setImage: (file: File | null) => void;
  existingImageUrl?: string | null;
  collection: string;
  recordId?: string;
}

export default function ImageUpload({ image, setImage, existingImageUrl, collection, recordId }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(existingImageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(existingImageUrl || null);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 block">Imagem (opcional)</label>
      <div className="border border-white/10 rounded-lg p-4 bg-white/5">
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Clique para upload</span> ou arraste e solte
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 10MB</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}

