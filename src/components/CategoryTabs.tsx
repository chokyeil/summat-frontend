import { CATEGORIES, type CategoryCode } from '../constants/categories';

interface CategoryTabsProps {
  active: CategoryCode;
  onSelect: (code: CategoryCode) => void;
}

export default function CategoryTabs({ active, onSelect }: CategoryTabsProps) {
  return (
    <nav className="category-tabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.code}
          type="button"
          className={`tab${active === cat.code ? ' active' : ''}`}
          onClick={() => onSelect(cat.code)}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
