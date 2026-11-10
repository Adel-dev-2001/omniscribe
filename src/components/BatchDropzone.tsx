import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { ProcessedImage, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { UploadCloud, Image as ImageIcon, AlertCircle, FilePlus2 } from 'lucide-react';

interface BatchDropzoneProps {
  language: SupportedLanguage;
  images: ProcessedImage[];
  onAddImages: (newImages: ProcessedImage[]) => void;
  maxLimit?: number;
}

export const BatchDropzone: React.FC<BatchDropzoneProps> = ({
  language,
  images,
  onAddImages,
  maxLimit = 20
}) => {
  const t = translations[language];
  const [isDragOver, setIsDragOver] = useState(false);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processFileList = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setLimitWarning(null);

    const validFiles: File[] = [];
    const currentCount = images.length;
    let ignoredCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        // Check if limit is reached
        if (currentCount + validFiles.length < maxLimit) {
          // Check duplicates by filename & size
          const isDuplicate = images.some(
            (existing) => existing.name === file.name && existing.size === file.size
          );
          if (!isDuplicate) {
            validFiles.push(file);
          }
        } else {
          ignoredCount++;
        }
      }
    }

    if (ignoredCount > 0) {
      setLimitWarning(t.dropzoneMaxFilesReached);
      setTimeout(() => setLimitWarning(null), 4000);
    }

    const processedNewImages: ProcessedImage[] = await Promise.all(
      validFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type || 'image/jpeg',
          status: 'idle',
          progress: 0,
          extractedText: '',
          timestamp: Date.now()
        };
      })
    );

    if (processedNewImages.length > 0) {
      onAddImages(processedNewImages);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    await processFileList(e.dataTransfer.files);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    await processFileList(e.target.files);
  };

  const remainingSlots = Math.max(0, maxLimit - images.length);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 transition-all duration-300 text-center ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 scale-[1.008]'
            : 'border-slate-300 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/40 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-slate-50/70 dark:hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg,image/bmp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/10 to-indigo-500/20 dark:from-sky-500/20 dark:to-indigo-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300 border border-sky-200 dark:border-sky-800/40">
              <UploadCloud className="w-8 h-8" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              {t.dropzoneTitle}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.dropzoneSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ImageIcon className="w-3.5 h-3.5 mr-1 text-sky-500" />
              {images.length} / {maxLimit} Images in Queue
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              <FilePlus2 className="w-3.5 h-3.5 mr-1" />
              {remainingSlots} Slots Available
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xl">
            {t.dropzoneFormatsNotice}
          </p>
        </div>
      </div>

      {limitWarning && (
        <div className="mt-3 flex items-center p-3 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 animate-fade-in">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{limitWarning}</span>
        </div>
      )}
    </div>
  );
};

