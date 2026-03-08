interface PlaceImageProps {
  /** TODO: PlacesDetailResDto에 placeImageUrl 추가 시 연결 */
  src?: string;
  alt: string;
}

export default function PlaceImage({ src, alt }: PlaceImageProps) {
  return (
    <section className="image-section">
      {src ? (
        <img src={src} alt={alt} className="main-img" />
      ) : (
        <div className="main-img card-img--empty" aria-hidden="true" />
      )}
    </section>
  );
}
