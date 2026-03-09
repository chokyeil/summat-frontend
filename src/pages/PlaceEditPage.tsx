import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlaceForm from '../components/PlaceForm';
import type { PlaceFormValues } from '../components/PlaceForm';
import { getPlaceDetailById, updatePlace } from '../api/places';
import type { ApiResponse } from '../types/auth';
import type { PlaceTagCode } from '../constants/placeTags';

export default function PlaceEditPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<PlaceFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(placeId);
    if (!placeId || isNaN(id)) {
      setError('잘못된 접근입니다.');
      setLoading(false);
      return;
    }
    getPlaceDetailById(id)
      .then((data) => {
        setInitialValues({
          name: data.placeName,
          lotAddress: data.lotAddress,
          roadAddress: data.roadAddress,
          category: data.category,
          region: data.region,
          tags: data.tags as PlaceTagCode[],
          summary: data.summary,
          description: data.description,
          image: null, // 이미지는 새로 선택 시에만 교체, 미선택 시 기존 이미지 유지
        });
      })
      .catch(() => setError('장소 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [placeId]);

  async function handleSubmit(values: PlaceFormValues) {
    const id = Number(placeId);
    if (!placeId || isNaN(id)) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('placeName', values.name);
      formData.append('lotAddress', values.lotAddress);
      formData.append('roadAddress', values.roadAddress);
      formData.append('category', values.category);
      formData.append('region', values.region);
      formData.append('summary', values.summary);
      formData.append('description', values.description);
      // tags: 동일 key 반복 append (FRONTEND_RULES §7, 백엔드 스펙)
      values.tags.forEach((tag) => formData.append('tags', tag));
      // image: 새 파일 선택 시에만 append — 미선택 시 기존 이미지 유지 (백엔드 정책)
      if (values.image) formData.append('image', values.image);

      await updatePlace(id, formData);
      navigate(`/places/${placeId}`);
    } catch (err) {
      const apiMessage = axios.isAxiosError(err)
        ? (err.response?.data as ApiResponse | undefined)?.message
        : undefined;
      setSubmitError(apiMessage ?? '수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDelete() {
    if (!confirm('정말 삭제하시겠어요?')) return;
    // TODO: 장소 삭제 API 엔드포인트 확정 후 deletePlace(placeId) 연동
  }

  if (loading) return <p className="status-message">로딩 중...</p>;
  if (error) return <p className="status-message" role="alert">{error}</p>;
  if (!initialValues) return null;

  return (
    <>
      <div className="place-create-header">
        <button type="button" className="btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>장소 수정</h1>
      </div>

      <main className="place-create-container">
        {submitError && <p className="status-message" role="alert">{submitError}</p>}
        <PlaceForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      </main>
    </>
  );
}
