from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductColor


class Command(BaseCommand):
    help = "Create demo EVA MODE products and color variants"

    def handle(self, *args, **options):
        categories = {
            "سوتین": "bras",
            "ست‌ها": "sets",
            "لباس خواب": "sleepwear",
            "شورت": "briefs",
        }
        category_objects = {}
        for name, slug in categories.items():
            category_objects[name], _ = Category.objects.get_or_create(slug=slug, defaults={"name": name})

        products = [
            ("سوتین دانتل کلاسیک", "classic-lace-bra", "سوتین", 890000, 1090000, "طراحی ظریف دانتل با فرم راحت و مناسب استفاده روزانه."),
            ("ست ساتن لوکس", "luxury-satin-set", "ست‌ها", 1290000, 1490000, "ست ظریف ساتن با طراحی مینیمال و حس لوکس EVA MODE."),
            ("لباس خواب سیلک", "silk-nightwear", "لباس خواب", 1590000, 1790000, "لباس خواب سبک و لطیف با طراحی ساده و زنانه."),
            ("شورت نخی راحتی", "cotton-comfort-brief", "شورت", 390000, 450000, "مدل نخی نرم و راحت برای استفاده روزمره."),
            ("سوتین بدون فنر", "wireless-elegance-bra", "سوتین", 990000, 1190000, "فرم بدون فنر با تمرکز بر راحتی و پوشش طبیعی."),
            ("ست دانتل رمانتیک", "romantic-lace-set", "ست‌ها", 1390000, 1590000, "ترکیب دانتل ظریف و طراحی مدرن برای یک انتخاب خاص."),
            ("Lemon Berry", "lemon-berry", "شورت", 449000, 529000, "شورت زنانه با طراحی لطیف و رنگ‌بندی جذاب، مناسب استفاده روزمره."),
            ("Beautiful Girl", "beautiful-girl", "شورت", 479000, 559000, "مدلی ظریف و راحت با طراحی زنانه و فرم مناسب."),
            ("EVA POP", "eva-pop", "شورت", 499000, 589000, "مدل مدرن و جوان‌پسند با طراحی متفاوت از کالکشن EVA MODE."),
        ]

        colors = {"مشکی": "#171717", "سفید": "#F7F5F0", "کرم": "#D9C5A8", "صورتی": "#D9A7AE"}

        for name, slug, category_name, price, old_price, description in products:
            product, _ = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "category": category_objects[category_name],
                    "name": name,
                    "price": price,
                    "old_price": old_price,
                    "description": description,
                    "is_active": True,
                },
            )
            for index, (color_name, hex_code) in enumerate(colors.items()):
                ProductColor.objects.update_or_create(
                    product=product,
                    name=color_name,
                    defaults={"hex_code": hex_code, "is_active": True, "sort_order": index},
                )
            self.stdout.write(self.style.SUCCESS(f"✓ {name}"))

        self.stdout.write(self.style.SUCCESS("\n۹ محصول دمو با ۴ رنگ ساخته شد."))
