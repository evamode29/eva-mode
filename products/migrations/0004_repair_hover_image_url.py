from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0002_product_gallery_colors"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="hover_image_url",
            field=models.URLField(blank=True, verbose_name="تصویر هنگام هاور"),
        ),
    ]
