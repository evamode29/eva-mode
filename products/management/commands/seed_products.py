from django.core.management.base import BaseCommand

from products.models import Category, Product


class Command(BaseCommand):
    help = "Create initial EVA MODE categories and sample products"

    def handle(self, *args, **options):
        categories = [
            ("سوتین", "bras"),
            ("ست‌ها", "sets"),
            ("شورت", "briefs"),
            ("لباس خواب", "sleepwear"),
        ]

        category_map = {}
        for name, slug in categories:
            category, _ = Category.objects.get_or_create(
                slug=slug, defaults={"name": name}
            )
            if category.name != name:
                category.name = name
                category.save(update_fields=["name"])
            category_map[slug] = category

        products = [
            {
                "name": "ست دانتل ظریف EVA",
                "slug": "eva-delicate-lace-set",
                "category": "sets",
                "price": 1290000,
                "old_price": 1490000,
                "description": "ست ظریف و راحت با طراحی مینیمال، مناسب استفاده روزمره و مهمانی.",
            },
            {
                "name": "سوتین کلاسیک روزمره",
                "slug": "classic-everyday-bra",
                "category": "bras",
                "price": 790000,
                "old_price": 890000,
                "description": "طراحی ساده و کاربردی با تمرکز روی راحتی و فرم مناسب.",
            },
            {
                "name": "شورت نخی راحتی",
                "slug": "cotton-comfort-brief",
                "category": "briefs",
                "price": 390000,
                "old_price": None,
                "description": "مدل سبک و راحت برای استفاده روزانه.",
            },
            {
                "name": "لباس خواب مینیمال",
                "slug": "minimal-sleepwear",
                "category": "sleepwear",
                "price": 1590000,
                "old_price": 1790000,
                "description": "لباس خواب مینیمال با ظاهر ظریف و پارچه لطیف.",
            },
        ]

        for item in products:
            Product.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "category": category_map[item["category"]],
                    "price": item["price"],
                    "old_price": item["old_price"],
                    "description": item["description"],
                    "is_active": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("EVA MODE sample products are ready."))
