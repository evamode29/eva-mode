from django.conf import settings
from django.db import models


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "در انتظار پرداخت"),
        ("paid", "پرداخت شده"),
        ("processing", "در حال آماده‌سازی"),
        ("shipped", "ارسال شده"),
        ("delivered", "تحویل شده"),
        ("cancelled", "لغو شده"),
    ]

    PAYMENT_CHOICES = [
        ("pending", "در انتظار پرداخت"),
        ("paid", "موفق"),
        ("failed", "ناموفق"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders", verbose_name="مشتری")
    full_name = models.CharField("نام گیرنده", max_length=160)
    mobile = models.CharField("موبایل", max_length=11)
    address = models.TextField("آدرس")
    postal_code = models.CharField("کد پستی", max_length=10, blank=True)
    city = models.CharField("شهر", max_length=100, default="تهران")
    total = models.PositiveBigIntegerField("مبلغ کل (تومان)", default=0)
    status = models.CharField("وضعیت سفارش", max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_status = models.CharField("وضعیت پرداخت", max_length=20, choices=PAYMENT_CHOICES, default="pending")
    tracking_code = models.CharField("کد پیگیری ارسال", max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"

    def __str__(self):
        return f"#{self.pk} - {self.full_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items", verbose_name="سفارش")
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT, verbose_name="محصول")
    product_name = models.CharField("نام محصول", max_length=200)
    unit_price = models.PositiveBigIntegerField("قیمت واحد (تومان)")
    quantity = models.PositiveIntegerField("تعداد", default=1)

    class Meta:
        verbose_name = "آیتم سفارش"
        verbose_name_plural = "آیتم‌های سفارش"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"
