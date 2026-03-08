import { REGIONS, type RegionCode } from '../constants/regions';
import ScrollableFilterRow from './ScrollableFilterRow';

interface RegionFilterChipsProps {
  active: RegionCode;
  onSelect: (code: RegionCode) => void;
}

export default function RegionFilterChips({ active, onSelect }: RegionFilterChipsProps) {
  return (
    <ScrollableFilterRow>
      {REGIONS.map((region) => (
        <button
          key={region.code}
          type="button"
          className={`chip${active === region.code ? ' active' : ''}`}
          onClick={() => onSelect(region.code)}
        >
          {region.label}
        </button>
      ))}
    </ScrollableFilterRow>
  );
}
