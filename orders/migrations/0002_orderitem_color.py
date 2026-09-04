from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0001_initial"),
        ("products", "0002_productcolor"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="color_name",
            field=models.CharField(blank=True, max_length=80, verbose_name="رنگ انتخابی"),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="color",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="products.productcolor", verbose_name="رنگ"),
        ),
    ]
