from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="hover_image_url",
            field=models.URLField(blank=True, verbose_name="تصویر هنگام هاور"),
        ),
        migrations.CreateModel(
            name="Color",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80, unique=True, verbose_name="نام رنگ")),
                ("hex_code", models.CharField(default="#c8b6a6", max_length=7, verbose_name="کد رنگ")),
            ],
            options={
                "verbose_name": "رنگ",
                "verbose_name_plural": "رنگ‌ها",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image_url", models.URLField(verbose_name="آدرس تصویر")),
                ("alt_text", models.CharField(blank=True, max_length=200, verbose_name="متن جایگزین")),
                ("sort_order", models.PositiveIntegerField(default=0, verbose_name="ترتیب")),
                ("is_hover", models.BooleanField(default=False, verbose_name="تصویر هاور")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="gallery", to="products.product", verbose_name="محصول")),
            ],
            options={
                "verbose_name": "تصویر محصول",
                "verbose_name_plural": "تصاویر محصول",
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.CreateModel(
            name="ProductColor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image_url", models.URLField(blank=True, verbose_name="تصویر این رنگ")),
                ("hover_image_url", models.URLField(blank=True, verbose_name="تصویر هاور این رنگ")),
                ("sort_order", models.PositiveIntegerField(default=0, verbose_name="ترتیب")),
                ("is_active", models.BooleanField(default=True, verbose_name="فعال")),
                ("color", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="product_colors", to="products.color", verbose_name="رنگ")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="colors", to="products.product", verbose_name="محصول")),
            ],
            options={
                "verbose_name": "رنگ محصول",
                "verbose_name_plural": "رنگ‌های محصول",
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.AddConstraint(
            model_name="productcolor",
            constraint=models.UniqueConstraint(fields=("product", "color"), name="unique_product_color"),
        ),
    ]
