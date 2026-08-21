import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const { product, images, variants, colors, sizes } = data;

  const stock = variants.reduce(
    (total, variant) =>
      total + (variant.isActive ? variant.stock : 0),
    0
  );

  return (
    <main>
      <section className="product-page">
        <Container>
          <div className="breadcrumb">
            خانه / فروشگاه / {product.name}
          </div>

          <div className="product-detail">
            <ProductGallery images={images} />

            <ProductInfo
              product={product}
              colors={colors}
              sizes={sizes}
              stock={stock}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}