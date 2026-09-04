from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("products", "0001_initial"),
    ]
    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=160, verbose_name="نام گیرنده")),
                ("mobile", models.CharField(max_length=11, verbose_name="موبایل")),
                ("address", models.TextField(verbose_name="آدرس")),
                ("postal_code", models.CharField(blank=True, max_length=10, verbose_name="کد پستی")),
                ("city", models.CharField(default="تهران", max_length=100, verbose_name="شهر")),
                ("total", models.PositiveBigIntegerField(default=0, verbose_name="مبلغ کل (تومان)")),
                ("status", models.CharField(choices=[("pending", "در انتظار پرداخت"), ("paid", "پرداخت شده"), ("processing", "در حال آماده‌سازی"), ("shipped", "ارسال شده"), ("delivered", "تحویل شده"), ("cancelled", "لغو شده")], default="pending", max_length=20, verbose_name="وضعیت سفارش")),
                ("payment_status", models.CharField(choices=[("pending", "در انتظار پرداخت"), ("paid", "موفق"), ("failed", "ناموفق")], default="pending", max_length=20, verbose_name="وضعیت پرداخت")),
                ("tracking_code", models.CharField(blank=True, max_length=80, verbose_name="کد پیگیری ارسال")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to=settings.AUTH_USER_MODEL, verbose_name="مشتری")),
            ],
            options={"verbose_name": "سفارش", "verbose_name_plural": "سفارش‌ها", "ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("product_name", models.CharField(max_length=200, verbose_name="نام محصول")),
                ("unit_price", models.PositiveBigIntegerField(verbose_name="قیمت واحد (تومان)")),
                ("quantity", models.PositiveIntegerField(default=1, verbose_name="تعداد")),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="orders.order", verbose_name="سفارش")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="products.product", verbose_name="محصول")),
            ],
            options={"verbose_name": "آیتم سفارش", "verbose_name_plural": "آیتم‌های سفارش"},
        ),
    ]
