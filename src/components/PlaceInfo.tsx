import type { PlaceDetailResDto } from '../types/place';

interface PlaceInfoProps {
  place: PlaceDetailResDto;
}

export default function PlaceInfo({ place }: PlaceInfoProps) {
  return (
    <>
      <div className="place-meta">
        {place.category} · {place.region}
      </div>
      <h1 className="place-name">{place.placeName}</h1>
    </>
  );
}
