from django.contrib import admin

from .models import Category, Product, ProductColor, ProductColorImage


class ProductColorImageInline(admin.TabularInline):
    model = ProductColorImage
    extra = 1
    min_num = 0
    fields = ("image", "preview", "sort_order", "is_active")
    readonly_fields = ("preview",)
    ordering = ("sort_order", "id")

    @admin.display(description="پیش‌نمایش")
    def preview(self, obj):
        if not obj.image:
            return "—"
        return admin.utils.mark_safe(
            f'<img src="{obj.image.url}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #ddd;" />'
        )


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = ("name", "hex_code", "image", "gallery_count", "is_active", "sort_order")
    readonly_fields = ("gallery_count",)
    ordering = ("sort_order", "id")

    @admin.display(description="تعداد تصاویر")
    def gallery_count(self, obj):
        if not obj.pk:
            return "—"
        count = obj.images.filter(is_active=True).count()
        return f"{count} تصویر"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductColorInline]


@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ("name", "product", "is_active", "sort_order", "image_count")
    list_filter = ("is_active", "product")
    search_fields = ("name", "product__name")
    inlines = [ProductColorImageInline]
    ordering = ("product", "sort_order", "id")

    @admin.display(description="تصاویر فعال")
    def image_count(self, obj):
        return obj.images.filter(is_active=True).count()


@admin.register(ProductColorImage)
class ProductColorImageAdmin(admin.ModelAdmin):
    list_display = ("color", "product_name", "sort_order", "is_active")
    list_filter = ("is_active", "color__product")
    search_fields = ("color__name", "color__product__name")
    ordering = ("color", "sort_order", "id")

    @admin.display(description="محصول")
    def product_name(self, obj):
        return obj.color.product.name
