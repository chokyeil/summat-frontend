import { useEffect, useRef, useState } from 'react';

interface ImageUploaderProps {
  image: File | null;
  onChange: (file: File | null) => void;
}

export default function ImageUploader({ image, onChange }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="pc-upload-area">
      <button
        type="button"
        className="pc-upload-btn"
        onClick={() => inputRef.current?.click()}
        aria-label="이미지 추가"
      >
        <span className="pc-upload-icon" aria-hidden="true">+</span>
        <span>사진 추가</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {previewUrl && (
        <div className="pc-img-preview">
          <img src={previewUrl} alt="업로드 미리보기" />
          <button
            type="button"
            className="pc-btn-remove"
            onClick={handleRemove}
            aria-label="이미지 삭제"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
