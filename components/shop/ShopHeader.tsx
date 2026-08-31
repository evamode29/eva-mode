import Link from "next/link";

export function ShopHeader({
  title = "فروشگاه EVA MODE",
  description = "انتخابی از لباس زیر زنانه با تمرکز بر ظرافت، راحتی و کیفیت.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="shop-header">
      <div className="container">
        <div className="shop-breadcrumb">
          <Link href="/">خانه</Link>
          <span>/</span>
          <span>فروشگاه</span>
        </div>

        <div className="shop-header-content">
          <div>
            <span className="shop-eyebrow">
              EVA MODE / COLLECTION
            </span>

            <h1>{title}</h1>

            <p>{description}</p>
          </div>

          <Link href="/" className="shop-back-link">
            بازگشت به خانه
            <span>←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}