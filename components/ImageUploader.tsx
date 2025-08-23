
import React, { useRef, useCallback } from 'react';
import { type ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  image: ImageFile | null;
  setImage: React.Dispatch<React.SetStateAction<ImageFile | null>>;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1];
        setImage({
          file,
          previewUrl: result,
          base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
       reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1];
        setImage({
          file,
          previewUrl: result,
          base64Data,
          mimeType: file.type
        });
       };
       reader.readAsDataURL(file);
    }
  }, [disabled, setImage]);

  const removeImage = () => {
    setImage(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={disabled}
      />
      {!image ? (
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            disabled ? 'bg-base-300/50 cursor-not-allowed' : 'bg-base-300 border-base-300 hover:border-brand-secondary hover:bg-base-200'
          }`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-content-200" />
            <p className="mb-2 text-sm text-content-200">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-content-200">PNG, JPG or WEBP</p>
          </div>
        </label>
      ) : (
        <div className="relative w-full h-48 group">
          <img src={image.previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <button
              onClick={removeImage}
              disabled={disabled}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
