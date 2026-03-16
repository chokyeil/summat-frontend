import { REGION_OPTIONS, type RegionCode } from '../constants/regions';
import ScrollableFilterRow from './ScrollableFilterRow';

interface RegionFilterChipsProps {
  active: RegionCode;
  onSelect: (code: RegionCode) => void;
}

export default function RegionFilterChips({ active, onSelect }: RegionFilterChipsProps) {
  return (
    <ScrollableFilterRow>
      {REGION_OPTIONS.map((region) => (
        <button
          key={region}
          type="button"
          className={`chip${active === region ? ' active' : ''}`}
          onClick={() => onSelect(region)}
        >
          {region}
        </button>
      ))}
    </ScrollableFilterRow>
  );
}
