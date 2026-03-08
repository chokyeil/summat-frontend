interface PlaceDescriptionProps {
  text: string;
}

export default function PlaceDescription({ text }: PlaceDescriptionProps) {
  return <p className="description">{text}</p>;
}
