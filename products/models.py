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
