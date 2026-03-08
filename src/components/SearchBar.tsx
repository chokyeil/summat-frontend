interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <section className="search-section">
      <input
        type="text"
        className="search-bar"
        placeholder="어떤 장소를 찾고 있나요?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
}
