import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ColorSelector } from "@/components/product/ColorSelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import type { Color, Product, Size } from "@/types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function ProductInfo({ product, colors, sizes, stock }: { product: Product; colors: Color[]; sizes: Size[]; stock: number }) {
  const available = product.isActive && stock > 0;
  return <div className="product-info">
    <div className="product-info-top"><Badge tone={available ? "success" : "sale"}>{available ? "موجود" : "ناموجود"}</Badge><span>برند: {product.brand}</span></div>
    <h1>{product.name}</h1>
    <p className="product-description">{product.description}</p>
    <div className="product-price"><strong>{formatPrice(product.basePrice)}</strong><span>تومان</span>{product.compareAtPrice && <del>{formatPrice(product.compareAtPrice)}</del>}</div>
    <ColorSelector colors={colors} />
    <SizeSelector sizes={sizes} />
    <Button className="add-to-cart-button">افزودن به سبد</Button>
  </div>;
}
