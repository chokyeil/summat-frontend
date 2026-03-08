import { PLACE_TAGS } from '../constants/placeTags';

const tagLabelMap = Object.fromEntries(PLACE_TAGS.map((t) => [t.code, t.label]));

interface TagChipsProps {
  tags: string[];
}

/** 상세 페이지용 비대화형 태그 칩 */
export default function TagChips({ tags }: TagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="tag-container">
      {tags.map((code) => (
        <span key={code} className="tag-chip">
          #{tagLabelMap[code] ?? code}
        </span>
      ))}
    </div>
  );
}
