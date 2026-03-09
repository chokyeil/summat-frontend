import { useState } from 'react';
import type { FormEvent } from 'react';

interface FormErrors {
  name?: string;
  lotAddress?: string;
  roadAddress?: string;
  category?: string;
  region?: string;
}
import { CATEGORIES } from '../constants/categories';
import { REGIONS } from '../constants/regions';
import { PLACE_TAGS } from '../constants/placeTags';
import type { PlaceTagCode } from '../constants/placeTags';
import ImageUploader from './ImageUploader';

export interface PlaceFormValues {
  name: string;
  lotAddress: string;  // 지번 주소 (백엔드 @NotBlank)
  roadAddress: string; // 도로명 주소 (백엔드 @NotBlank)
  category: string;
  region: string;
  tags: PlaceTagCode[];
  summary: string;
  description: string;
  image: File | null;
}

interface PlaceFormProps {
  mode: 'create' | 'edit';
  initialValues: PlaceFormValues;
  onSubmit: (values: PlaceFormValues) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export default function PlaceForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  isSubmitting = false,
}: PlaceFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [lotAddress, setLotAddress] = useState(initialValues.lotAddress);
  const [roadAddress, setRoadAddress] = useState(initialValues.roadAddress);
  const [category, setCategory] = useState(initialValues.category);
  const [region, setRegion] = useState(initialValues.region);
  const [tags, setTags] = useState<PlaceTagCode[]>(initialValues.tags);
  const [summary, setSummary] = useState(initialValues.summary);
  const [description, setDescription] = useState(initialValues.description);
  const [image, setImage] = useState<File | null>(initialValues.image);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleTagToggle(code: PlaceTagCode) {
    setTags((prev) =>
      prev.includes(code) ? prev.filter((t) => t !== code) : [...prev, code]
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = '장소명을 입력해주세요.';
    if (!lotAddress.trim()) newErrors.lotAddress = '지번 주소를 입력해주세요.';
    if (!roadAddress.trim()) newErrors.roadAddress = '도로명 주소를 입력해주세요.';
    if (!category) newErrors.category = '카테고리를 선택해주세요.';
    if (!region) newErrors.region = '지역을 선택해주세요.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit({ name, lotAddress, roadAddress, category, region, tags, summary, description, image });
  }

  const submitLabel = mode === 'edit' ? '수정하기' : '등록하기';

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 장소명 */}
      <div className="pc-form-group">
        <label htmlFor="place-name" className="pc-form-label">장소명</label>
        <input
          id="place-name"
          type="text"
          className="pc-input"
          placeholder="예: 브루클린 카페"
          value={name}
          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((prev) => ({ ...prev, name: undefined })); }}
        />
        {errors.name && <p className="pc-field-error">{errors.name}</p>}
      </div>

      {/* 지번 주소 */}
      <div className="pc-form-group">
        <label htmlFor="place-lot-address" className="pc-form-label">지번 주소</label>
        <input
          id="place-lot-address"
          type="text"
          className="pc-input"
          placeholder="예: 서울 성동구 성수동1가 685-10"
          value={lotAddress}
          onChange={(e) => { setLotAddress(e.target.value); if (errors.lotAddress) setErrors((prev) => ({ ...prev, lotAddress: undefined })); }}
        />
        {errors.lotAddress && <p className="pc-field-error">{errors.lotAddress}</p>}
      </div>

      {/* 도로명 주소 */}
      <div className="pc-form-group">
        <label htmlFor="place-road-address" className="pc-form-label">도로명 주소</label>
        <input
          id="place-road-address"
          type="text"
          className="pc-input"
          placeholder="예: 서울 성동구 성수이로7길 11"
          value={roadAddress}
          onChange={(e) => { setRoadAddress(e.target.value); if (errors.roadAddress) setErrors((prev) => ({ ...prev, roadAddress: undefined })); }}
        />
        {errors.roadAddress && <p className="pc-field-error">{errors.roadAddress}</p>}
      </div>

      {/* 카테고리 */}
      <div className="pc-form-group">
        <span className="pc-form-label">카테고리</span>
        <div className="pc-chip-group">
          {CATEGORIES.filter((cat) => cat.code !== 'all').map((cat) => (
            <button
              key={cat.code}
              type="button"
              className={`pc-chip${category === cat.code ? ' selected' : ''}`}
              onClick={() => { setCategory(cat.code); if (errors.category) setErrors((prev) => ({ ...prev, category: undefined })); }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {errors.category && <p className="pc-field-error">{errors.category}</p>}
      </div>

      {/* 지역 */}
      <div className="pc-form-group">
        <span className="pc-form-label">지역</span>
        <div className="pc-scroll-wrapper">
          {REGIONS.filter((r) => r.code !== 'all').map((reg) => (
            <button
              key={reg.code}
              type="button"
              className={`pc-chip${region === reg.code ? ' selected' : ''}`}
              onClick={() => { setRegion(reg.code); if (errors.region) setErrors((prev) => ({ ...prev, region: undefined })); }}
            >
              {reg.label}
            </button>
          ))}
        </div>
        {errors.region && <p className="pc-field-error">{errors.region}</p>}
      </div>

      {/* 장소 특징 태그 */}
      <div className="pc-form-group">
        <span className="pc-form-label">장소 특징 태그</span>
        <div className="pc-chip-group">
          {PLACE_TAGS.map((tag) => (
            <button
              key={tag.code}
              type="button"
              className={`pc-tag-pill${tags.includes(tag.code) ? ' active' : ''}`}
              onClick={() => handleTagToggle(tag.code)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* 간단 소개 — 카드/리스트용 oneLineDesc */}
      <div className="pc-form-group">
        <label htmlFor="place-summary" className="pc-form-label">간단 소개</label>
        <textarea
          id="place-summary"
          className="pc-input pc-textarea-short"
          placeholder="한 줄로 장소 특징을 소개해주세요. (예: 작업하기 좋고 조용한 분위기의 카페예요.)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      {/* 상세 설명 — 상세페이지용 placeDescription */}
      <div className="pc-form-group">
        <label htmlFor="place-description" className="pc-form-label">상세 설명</label>
        <textarea
          id="place-description"
          className="pc-input pc-textarea-long"
          placeholder="이 장소의 분위기, 장점, 추천 포인트를 자유롭게 소개해주세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* 대표 이미지 */}
      <div className="pc-form-group">
        <span className="pc-form-label">대표 이미지</span>
        <ImageUploader image={image} onChange={setImage} />
      </div>

      <button type="submit" className="pc-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : submitLabel}
      </button>

      {mode === 'edit' && onDelete && (
        <button type="button" className="pc-delete-btn" onClick={onDelete}>
          삭제하기
        </button>
      )}
    </form>
  );
}
