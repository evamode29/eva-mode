from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductColor, ProductColorImage, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "color", "color_code", "preview", "sort_order", "is_active")
    readonly_fields = ("preview", "color_code")
    ordering = ("sort_order", "id")

    @admin.display(description="کد رنگ")
    def color_code(self, obj):
        if not obj.color_id or not obj.color.hex_code:
            return "—"
        return format_html('<span style="display:inline-flex;align-items:center;gap:6px"><i style="width:18px;height:18px;border-radius:50%;background:{};border:1px solid #ccc;display:inline-block"></i>{}</span>', obj.color.hex_code, obj.color.hex_code)

    @admin.display(description="پیش‌نمایش")
    def preview(self, obj):
        if not obj.image:
            return "—"
        return format_html('<img src="{}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #ddd;" />', obj.image.url)


class ProductColorImageInline(admin.TabularInline):
    model = ProductColorImage
    extra = 1
    fields = ("image", "preview", "sort_order", "is_active")
    readonly_fields = ("preview",)
    ordering = ("sort_order", "id")

    @admin.display(description="پیش‌نمایش")
    def preview(self, obj):
        if not obj.image:
            return "—"
        return format_html('<img src="{}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #ddd;" />', obj.image.url)


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
        return f"{obj.images.filter(is_active=True).count()} تصویر"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "image_count", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductColorInline]

    @admin.display(description="تصاویر محصول")
    def image_count(self, obj):
        return obj.images.filter(is_active=True).count()


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "color", "preview", "sort_order", "is_active")
    list_filter = ("is_active", "product__category")
    search_fields = ("product__name", "color__name")
    ordering = ("product", "sort_order", "id")
    readonly_fields = ("preview",)

    @admin.display(description="پیش‌نمایش")
    def preview(self, obj):
        if not obj.image:
            return "—"
        return format_html('<img src="{}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #ddd;" />', obj.image.url)


@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ("name", "product", "hex_code", "is_active", "sort_order", "image_count")
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
