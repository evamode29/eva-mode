import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { ProductDetailsClient } from "@/components/product/ProductDetailsClient";

import { getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const data =
    await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const {
    product,
    images,
    variants,
    colors,
    sizes,
  } = data;

  const stock = variants.reduce(
    (total, variant) =>
      total +
      (variant.isActive
        ? variant.stock
        : 0),
    0
  );

  const primaryImage =
    images.find(
      (image) => image.isPrimary
    ) ??
    images[0] ??
    null;

  return (
    <main>
      <section className="product-page">
        <Container>
          <div className="breadcrumb">
            خانه / فروشگاه /{" "}
            {product.name}
          </div>

          <ProductDetailsClient
            product={product}
            images={images}
            variants={variants}
            colors={colors}
            sizes={sizes}
            stock={stock}
            primaryImage={
              primaryImage
            }
          />
        </Container>
      </section>
    </main>
  );
}