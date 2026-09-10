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
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products", verbose_name="دسته‌بندی"
    )
    name = models.CharField("نام محصول", max_length=200)
    slug = models.SlugField("نامک", unique=True)
    price = models.PositiveBigIntegerField("قیمت (تومان)")
    old_price = models.PositiveBigIntegerField("قیمت قبلی (تومان)", blank=True, null=True)
    description = models.TextField("توضیحات", blank=True)
    image = models.ImageField("تصویر اصلی", upload_to="products/", blank=True, null=True)
    hover_image = models.ImageField("تصویر هاور", upload_to="products/", blank=True, null=True)
    image_url = models.URLField("تصویر اصلی (آدرس قدیمی)", blank=True)
    hover_image_url = models.URLField("تصویر هاور (آدرس قدیمی)", blank=True)
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
    def main_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url

    @property
    def main_hover_image_url(self):
        if self.hover_image:
            return self.hover_image.url
        return self.hover_image_url


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="gallery", verbose_name="محصول"
    )
    image = models.ImageField("تصویر", upload_to="products/gallery/", blank=True, null=True)
    image_url = models.URLField("آدرس تصویر قدیمی", blank=True)
    alt_text = models.CharField("متن جایگزین", max_length=200, blank=True)
    sort_order = models.PositiveIntegerField("ترتیب", default=0)
    is_hover = models.BooleanField("تصویر هاور", default=False)

    class Meta:
        verbose_name = "تصویر محصول"
        verbose_name_plural = "تصاویر محصول"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} - تصویر {self.sort_order}"

    @property
    def display_url(self):
        if self.image:
            return self.image.url
        return self.image_url


class Color(models.Model):
    name = models.CharField("نام رنگ", max_length=80, unique=True)
    hex_code = models.CharField("کد رنگ", max_length=7, default="#c8b6a6")

    class Meta:
        verbose_name = "رنگ"
        verbose_name_plural = "رنگ‌ها"
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductColor(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="colors", verbose_name="محصول"
    )
    color = models.ForeignKey(
        Color, on_delete=models.PROTECT, related_name="product_colors", verbose_name="رنگ"
    )
    image = models.ImageField("تصویر این رنگ", upload_to="products/colors/", blank=True, null=True)
    hover_image = models.ImageField("تصویر هاور این رنگ", upload_to="products/colors/", blank=True, null=True)
    image_url = models.URLField("تصویر این رنگ (آدرس قدیمی)", blank=True)
    hover_image_url = models.URLField("تصویر هاور این رنگ (آدرس قدیمی)", blank=True)
    sort_order = models.PositiveIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "رنگ محصول"
        verbose_name_plural = "رنگ‌های محصول"
        ordering = ["sort_order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["product", "color"], name="unique_product_color")
        ]

    def __str__(self):
        return f"{self.product.name} - {self.color.name}"

    @property
    def display_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url

    @property
    def display_hover_image_url(self):
        if self.hover_image:
            return self.hover_image.url
        return self.hover_image_url


class Size(models.Model):
    name = models.CharField("سایز", max_length=30, unique=True)
    sort_order = models.PositiveIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "سایز"
        verbose_name_plural = "سایزها"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="sizes", verbose_name="محصول"
    )
    size = models.ForeignKey(
        Size, on_delete=models.PROTECT, related_name="product_sizes", verbose_name="سایز"
    )
    stock = models.PositiveIntegerField("موجودی", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "سایز محصول"
        verbose_name_plural = "سایزهای محصول"
        constraints = [
            models.UniqueConstraint(fields=["product", "size"], name="unique_product_size")
        ]

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"
