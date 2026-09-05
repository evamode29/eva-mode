from pathlib import Path

from django.conf import settings
from django.db import models
from django.urls import reverse


class Category(models.Model):
    name = models.CharField("نام", max_length=120)
    slug = models.SlugField("نامک", unique=True)

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products", verbose_name="دسته‌بندی")
    name = models.CharField("نام محصول", max_length=200)
    slug = models.SlugField("نامک", unique=True)
    price = models.PositiveBigIntegerField("قیمت (تومان)")
    old_price = models.PositiveBigIntegerField("قیمت قبلی (تومان)", blank=True, null=True)
    description = models.TextField("توضیحات", blank=True)
    image_url = models.URLField("آدرس تصویر", blank=True)
    is_active = models.BooleanField("فعال", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("products:detail", kwargs={"slug": self.slug})

    @property
    def primary_color(self):
        return self.colors.filter(is_active=True).first()

    @property
    def gallery_images(self):
        """Return local product gallery images in natural filename order."""
        media_root = Path(settings.MEDIA_ROOT)
        products_root = media_root / "products"
        if not products_root.exists():
            return []

        extensions = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
        category_slug = self.category.slug if self.category_id else ""
        category_folders = [category_slug]
        if category_slug == "briefs":
            category_folders.append("panties")
        elif category_slug == "panties":
            category_folders.append("briefs")

        folders = [products_root / folder / self.slug for folder in category_folders]
        folders.append(products_root / self.slug)

        candidates = []
        for folder in folders:
            if not folder.is_dir():
                continue
            candidates = [
                path for path in folder.iterdir()
                if path.is_file() and path.suffix.lower() in extensions
            ]
            if candidates:
                break

        def natural_key(path):
            stem = path.stem.lower()
            return (0, int(stem)) if stem.isdigit() else (1, stem)

        candidates.sort(key=natural_key)
        return [
            f"{settings.MEDIA_URL.rstrip('/')}/{path.relative_to(media_root).as_posix()}"
            for path in candidates
        ]

    @property
    def primary_image_url(self):
        """Return the first gallery image, with a legacy slug-named fallback."""
        gallery = self.gallery_images
        if gallery:
            return gallery[0]

        media_root = Path(settings.MEDIA_ROOT)
        products_root = media_root / "products"
        if not products_root.exists():
            return ""

        extensions = (".jpg", ".jpeg", ".png", ".webp", ".avif")
        for extension in extensions:
            matches = products_root.rglob(f"{self.slug}{extension}")
            try:
                image_path = next(matches)
            except StopIteration:
                continue
            relative_path = image_path.relative_to(media_root).as_posix()
            return f"{settings.MEDIA_URL.rstrip('/')}/{relative_path}"
        return ""

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round((self.old_price - self.price) * 100 / self.old_price)
        return 0


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="colors", verbose_name="محصول")
    name = models.CharField("نام رنگ", max_length=50)
    hex_code = models.CharField("کد رنگ", max_length=7, blank=True, default="")
    image = models.ImageField("تصویر رنگ", upload_to="products/colors/", blank=True, null=True)
    is_active = models.BooleanField("فعال", default=True)
    sort_order = models.PositiveIntegerField("ترتیب", default=0)

    class Meta:
        verbose_name = "رنگ محصول"
        verbose_name_plural = "رنگ‌های محصول"
        ordering = ["sort_order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["product", "name"], name="unique_product_color_name"),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name}"
