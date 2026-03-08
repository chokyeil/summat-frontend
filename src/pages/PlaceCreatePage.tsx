import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceForm from '../components/PlaceForm';
import type { PlaceFormValues } from '../components/PlaceForm';
import { createPlace } from '../api/places';
import type { ApiResponse } from '../types/auth';

export default function PlaceCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: PlaceFormValues = {
    name: '',
    lotAddress: '',
    roadAddress: '',
    category: '',
    region: '',
    tags: [],
    summary: '',
    description: '',
    image: null,
  };

  async function handleSubmit(values: PlaceFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('placeName', values.name);
      formData.append('category', values.category);
      formData.append('region', values.region);
      formData.append('lotAddress', values.lotAddress);
      formData.append('roadAddress', values.roadAddress);
      formData.append('summary', values.summary);
      formData.append('description', values.description);
      // tags: 동일 key 반복 append (FRONTEND_RULES §7, 백엔드 스펙)
      values.tags.forEach((tag) => formData.append('tags', tag));
      // image: optional — 있을 때만 append
      if (values.image) formData.append('image', values.image);

      await createPlace(formData);
      navigate('/places');
    } catch (err) {
      const apiMessage = axios.isAxiosError(err)
        ? (err.response?.data as ApiResponse | undefined)?.message
        : undefined;
      setSubmitError(apiMessage ?? '등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="place-create-header">
        <button type="button" className="btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>장소 등록</h1>
      </div>

      <main className="place-create-container">
        <section className="pc-intro">
          <p>
            나만 아는 카페와 맛집을 숨맛에 공유해보세요.<br />
            간단한 정보만 입력하면 바로 등록할 수 있어요.
          </p>
        </section>
        {submitError && <p className="status-message" role="alert">{submitError}</p>}
        <PlaceForm mode="create" initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </>
  );
}
