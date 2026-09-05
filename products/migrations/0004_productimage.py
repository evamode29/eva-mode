from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0003_productcolorimage"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="products/gallery/", verbose_name="تصویر محصول")),
                ("sort_order", models.PositiveIntegerField(default=0, verbose_name="ترتیب")),
                ("is_active", models.BooleanField(default=True, verbose_name="فعال")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="products.product", verbose_name="محصول")),
            ],
            options={
                "verbose_name": "تصویر محصول",
                "verbose_name_plural": "تصاویر محصولات",
                "ordering": ["sort_order", "id"],
            },
        ),
    ]
