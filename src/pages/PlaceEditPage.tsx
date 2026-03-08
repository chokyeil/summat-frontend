import { useNavigate, useParams } from 'react-router-dom';
import PlaceForm from '../components/PlaceForm';
import type { PlaceFormValues } from '../components/PlaceForm';
import type { PlaceTagCode } from '../constants/placeTags';

export default function PlaceEditPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();

  // TODO: API 연동 시 placeId로 getPlaceDetail(placeId) 호출하여 initialValues 설정
  void placeId;

  // TODO: 실제 API 연동 시 useEffect + getPlaceDetail(placeId) 결과로 교체
  // TODO: API 연동 시 getPlaceDetailById(placeId) 결과로 교체
  const initialValues: PlaceFormValues = {
    name: '브루클린 카페',
    lotAddress: '서울 성동구 성수동1가 685-10',
    roadAddress: '서울 성동구 성수이로7길 11',
    category: '카페',
    region: '서울',
    tags: ['wifi', 'mood'] as PlaceTagCode[],
    summary: '성수동 감성 카페',
    description: '조용하고 작업하기 좋은 성수동의 대표 카페입니다.',
    image: null,
  };

  function handleSubmit(values: PlaceFormValues) {
    // TODO: FormData 빌드 후 updatePlace(placeId, formData) API 연동 (FRONTEND_RULES.md §7)
    // const formData = new FormData();
    // formData.append('placeName', values.name);
    // formData.append('placeType', values.category);
    // formData.append('placeRegion', values.region);
    // values.tags.forEach((tag) => formData.append('tags', tag));
    // formData.append('oneLineDesc', values.summary);
    // formData.append('placeDescription', values.description);
    // if (values.image) formData.append('image', values.image);
    // await updatePlace(placeId, formData); // src/api/places.ts에 구현 예정
    void values;
  }

  function handleDelete() {
    if (!confirm('정말 삭제하시겠어요?')) return;
    // TODO: deletePlace(placeId) API 연동 후 navigate('/places')
    // await deletePlace(placeId); // src/api/places.ts에 구현 예정
    // navigate('/places');
  }

  return (
    <>
      <div className="place-create-header">
        <button type="button" className="btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>장소 수정</h1>
      </div>

      <main className="place-create-container">
        <PlaceForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </main>
    </>
  );
}
