from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("products", "0004_productimage")]

    operations = [
        migrations.AddField(
            model_name="productimage",
            name="color",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="product_images",
                to="products.productcolor",
                verbose_name="رنگ تصویر",
            ),
        ),
    ]
