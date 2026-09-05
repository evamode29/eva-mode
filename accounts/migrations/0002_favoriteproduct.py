from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
        ("products", "0005_productimage_color"),
    ]

    operations = [
        migrations.CreateModel(
            name="FavoriteProduct",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="favorited_by", to="products.product", verbose_name="محصول")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="favorite_products", to="auth.user", verbose_name="کاربر")),
            ],
            options={
                "verbose_name": "علاقه‌مندی",
                "verbose_name_plural": "علاقه‌مندی‌ها",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="favoriteproduct",
            constraint=models.UniqueConstraint(fields=("user", "product"), name="unique_user_favorite_product"),
        ),
    ]
