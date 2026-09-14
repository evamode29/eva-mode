from django.conf import settings
from django.db import models

from products.models import Color, Product, Size


class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    color = models.ForeignKey(Color, on_delete=models.PROTECT, null=True, blank=True)
    size = models.ForeignKey(Size, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [models.UniqueConstraint(fields=["user", "product", "color", "size"], name="unique_user_cart_line")]

    @property
    def line_total(self):
        return self.product.price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "در انتظار بررسی"),
        ("confirmed", "تأیید شده"),
        ("processing", "در حال آماده‌سازی"),
        ("shipped", "تحویل به پست"),
        ("delivered", "تحویل شده"),
        ("cancelled", "لغو شده"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")
    number = models.CharField(max_length=24, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    full_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=30)
    province = models.CharField(max_length=80)
    city = models.CharField(max_length=80)
    address = models.TextField()
    postal_code = models.CharField(max_length=20, blank=True)
    note = models.TextField(blank=True)
    subtotal = models.PositiveBigIntegerField(default=0)
    shipping = models.PositiveBigIntegerField(default=0)
    total = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    color = models.ForeignKey(Color, on_delete=models.PROTECT, null=True, blank=True)
    size = models.ForeignKey(Size, on_delete=models.PROTECT, null=True, blank=True)
    product_name = models.CharField(max_length=200)
    color_name = models.CharField(max_length=80, blank=True)
    size_name = models.CharField(max_length=30, blank=True)
    unit_price = models.PositiveBigIntegerField()
    quantity = models.PositiveIntegerField(default=1)

    @property
    def line_total(self):
        return self.unit_price * self.quantity
