from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("products", "0003_size_product_hover_image_product_image_and_more"),
    ]
    operations = [
        migrations.CreateModel(name="CartItem", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("quantity", models.PositiveIntegerField(default=1)), ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)),
            ("color", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="products.color")),
            ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="cart_items", to="products.product")),
            ("size", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="products.size")),
            ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="cart_items", to=settings.AUTH_USER_MODEL)),
        ], options={"ordering": ["-updated_at"]}),
        migrations.CreateModel(name="Order", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("number", models.CharField(max_length=24, unique=True)),
            ("status", models.CharField(choices=[("pending", "در انتظار بررسی"), ("confirmed", "تأیید شده"), ("processing", "در حال آماده‌سازی"), ("shipped", "تحویل به پست"), ("delivered", "تحویل شده"), ("cancelled", "لغو شده")], default="pending", max_length=20)),
            ("full_name", models.CharField(max_length=160)), ("phone", models.CharField(max_length=30)), ("province", models.CharField(max_length=80)), ("city", models.CharField(max_length=80)), ("address", models.TextField()), ("postal_code", models.CharField(blank=True, max_length=20)), ("note", models.TextField(blank=True)),
            ("subtotal", models.PositiveBigIntegerField(default=0)), ("shipping", models.PositiveBigIntegerField(default=0)), ("total", models.PositiveBigIntegerField(default=0)), ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)),
            ("user", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to=settings.AUTH_USER_MODEL)),
        ], options={"ordering": ["-created_at"]}),
        migrations.CreateModel(name="OrderItem", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("product_name", models.CharField(max_length=200)), ("color_name", models.CharField(blank=True, max_length=80)), ("size_name", models.CharField(blank=True, max_length=30)), ("unit_price", models.PositiveBigIntegerField()), ("quantity", models.PositiveIntegerField(default=1)),
            ("color", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="products.color")), ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="dashboard.order")), ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="products.product")), ("size", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="products.size")),
        ]),
        migrations.AddConstraint(model_name="cartitem", constraint=models.UniqueConstraint(fields=("user", "product", "color", "size"), name="unique_user_cart_line")),
    ]
