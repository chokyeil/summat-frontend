import { PLACE_TAGS, type PlaceTagCode } from '../constants/placeTags';
import ScrollableFilterRow from './ScrollableFilterRow';

interface TagFilterChipsProps {
  selected: PlaceTagCode[];
  onToggle: (code: PlaceTagCode) => void;
}

export default function TagFilterChips({ selected, onToggle }: TagFilterChipsProps) {
  return (
    <ScrollableFilterRow className="tag-chips">
      {PLACE_TAGS.map((tag) => (
        <button
          key={tag.code}
          type="button"
          className={`chip${selected.includes(tag.code) ? ' selected' : ''}`}
          onClick={() => onToggle(tag.code)}
        >
          #{tag.label}
        </button>
      ))}
    </ScrollableFilterRow>
  );
}
