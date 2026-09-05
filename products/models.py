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
        uploaded = [item.image.url for item in self.images.filter(is_active=True).order_by("sort_order", "id") if item.image]
        if uploaded:
            return uploaded
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
            candidates = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in extensions]
            if candidates:
                break
        def natural_key(path):
            stem = path.stem.lower()
            return (0, int(stem)) if stem.isdigit() else (1, stem)
        candidates.sort(key=natural_key)
        return [f"{settings.MEDIA_URL.rstrip('/')}/{p.relative_to(media_root).as_posix()}" for p in candidates]

    @property
    def primary_image_url(self):
        gallery = self.gallery_images
        return gallery[0] if gallery else ""

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round((self.old_price - self.price) * 100 / self.old_price)
        return 0


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images", verbose_name="محصول")
    color = models.ForeignKey("ProductColor", on_delete=models.SET_NULL, related_name="product_images", verbose_name="رنگ تصویر", blank=True, null=True)
    image = models.ImageField("تصویر محصول", upload_to="products/gallery/")
    sort_order = models.PositiveIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "تصویر محصول"
        verbose_name_plural = "تصاویر محصولات"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} - {self.color.name if self.color_id else 'بدون رنگ'} - {self.id}"


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="colors", verbose_name="محصول")
    name = models.CharField("نام رنگ", max_length=50)
    hex_code = models.CharField("کد رنگ", max_length=7, blank=True, default="")
    image = models.ImageField("تصویر اصلی رنگ", upload_to="products/colors/", blank=True, null=True)
    is_active = models.BooleanField("فعال", default=True)
    sort_order = models.PositiveIntegerField("ترتیب", default=0)

    class Meta:
        verbose_name = "رنگ محصول"
        verbose_name_plural = "رنگ‌های محصول"
        ordering = ["sort_order", "id"]
        constraints = [models.UniqueConstraint(fields=["product", "name"], name="unique_product_color_name")]

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    @property
    def gallery_images(self):
        images = list(self.images.filter(is_active=True).order_by("sort_order", "id"))
        urls = [item.image.url for item in images if item.image]
        if urls:
            return urls
        if self.image:
            return [self.image.url]
        return [item.image.url for item in self.product_images.filter(is_active=True).order_by("sort_order", "id") if item.image]

    @property
    def primary_image_url(self):
        gallery = self.gallery_images
        return gallery[0] if gallery else ""


class ProductColorImage(models.Model):
    color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, related_name="images", verbose_name="رنگ")
    image = models.ImageField("تصویر", upload_to="products/color-galleries/")
    sort_order = models.PositiveIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "تصویر گالری رنگ"
        verbose_name_plural = "تصاویر گالری رنگ"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.color.product.name} - {self.color.name} - {self.id}"
