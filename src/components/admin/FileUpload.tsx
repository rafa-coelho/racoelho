"use client";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  existingFiles?: Array<{ name: string; url: string }>;
  collection: string;
  recordId?: string;
  accept?: string;
  maxFiles?: number;
}

export default function FileUpload({
  files,
  setFiles,
  existingFiles = [],
  collection,
  recordId,
  accept = "*",
  maxFiles = 10,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (files.length + newFiles.length > maxFiles) {
      alert(`Você pode adicionar no máximo ${maxFiles} arquivos`);
      return;
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Criar previews para imagens
    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => new Map(prev).set(file.name, reader.result as string));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    
    // Remover preview
    const fileToRemove = files[index];
    setPreviews((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileToRemove.name);
      return newMap;
    });
  };

  const removeExistingFile = (fileName: string) => {
    // Isso só marca para remoção no backend
    // O backend precisará lidar com a remoção real
    console.log(`Marcar ${fileName} para remoção`);
  };

  const isImage = (file: File | string): boolean => {
    if (typeof file === 'string') {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file);
    }
    return file.type.startsWith('image/');
  };

  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 block">
        Arquivos {maxFiles > 1 && `(máximo ${maxFiles})`}
      </label>
      <div className="space-y-4">
        {/* Arquivos existentes */}
        {existingFiles.length > 0 && (
          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <h3 className="text-sm font-medium mb-2">Arquivos existentes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {existingFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {isImage(file.name) ? (
                    <div className="relative aspect-square">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExistingFile(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-lg p-3 bg-white/5 text-center">
                      <p className="text-xs text-muted-foreground truncate">{file.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview de novos arquivos */}
        {files.length > 0 && (
          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <h3 className="text-sm font-medium mb-2">Novos arquivos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {isImage(file) ? (
                    <div className="relative aspect-square">
                      {previews.has(file.name) ? (
                        <img
                          src={previews.get(file.name)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-lg p-3 bg-white/5 text-center relative">
                      <p className="text-xs text-muted-foreground truncate mb-2">{file.name}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Área de upload */}
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Clique para upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-muted-foreground">
                {files.length}/{maxFiles} arquivos
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple
              onChange={handleFileChange}
              disabled={files.length >= maxFiles}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

