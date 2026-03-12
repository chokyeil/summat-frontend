import type { PlaceListItemResDto } from '../types/place';
import PlaceCard from './PlaceCard';

interface PlaceCardListProps {
  places: PlaceListItemResDto[];
  onLike?: (placeId: number) => void;
}

export default function PlaceCardList({ places, onLike }: PlaceCardListProps) {
  return (
    <div className="place-grid">
      {places.map((place) => (
        <PlaceCard
          key={place.placeId}
          place={place}
          onLike={onLike ? () => onLike(place.placeId) : undefined}
        />
      ))}
    </div>
  );
}
