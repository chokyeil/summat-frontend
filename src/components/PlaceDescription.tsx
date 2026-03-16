interface PlaceDescriptionProps {
  text: string | null;
}

export default function PlaceDescription({ text }: PlaceDescriptionProps) {
  if (!text?.trim()) return null;

  return (
    <div className="place-description">
      {text.split('\n').map((line, i) => (
        <p key={i} className="description-line">{line}</p>
      ))}
    </div>
  );
}
