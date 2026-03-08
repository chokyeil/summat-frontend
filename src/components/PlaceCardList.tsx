import type { PlaceListItemResDto } from '../types/place';
import PlaceCard from './PlaceCard';

interface PlaceCardListProps {
  places: PlaceListItemResDto[];
}

export default function PlaceCardList({ places }: PlaceCardListProps) {
  return (
    <div className="place-grid">
      {places.map((place) => (
        <PlaceCard key={place.placeId} place={place} />
      ))}
    </div>
  );
}
