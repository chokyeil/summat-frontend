import { PLACEHOLDER_IMAGE } from '../utils/imageUrl';

interface PlaceImageProps {
  src?: string;
  alt: string;
}

export default function PlaceImage({ src, alt }: PlaceImageProps) {
  return (
    <section className="image-section">
      <img
        src={src || PLACEHOLDER_IMAGE}
        alt={alt}
        className="main-img"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fallbackApplied === 'true') return;
          img.dataset.fallbackApplied = 'true';
          img.src = PLACEHOLDER_IMAGE;
        }}
      />
    </section>
  );
}
