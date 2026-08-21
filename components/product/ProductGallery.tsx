import type { ProductImage } from "@/types";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  return <div className="gallery"><div className="visual-placeholder gallery-main"><span>PRODUCT IMAGE</span></div><div className="gallery-thumbs">{images.map((image) => <button type="button" className="visual-placeholder gallery-thumb" key={image.id} aria-label={image.alt}><span>{image.sortOrder}</span></button>)}</div></div>;
}
