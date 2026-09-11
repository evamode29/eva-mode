from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Color, Product, ProductColor, ProductImage, ProductSize, Size


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 2
    fields = ("preview", "image", "image_url", "alt_text", "sort_order", "is_hover")
    readonly_fields = ("preview",)

    @admin.display(description="پیش‌نمایش")
    def preview(self, obj):
        url = obj.display_url if obj.pk else ""
        if not url:
            return "—"
        return format_html(
            '<img src="{}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #eee;" />',
            url,
        )


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = (
        "color",
        "preview",
        "image",
        "hover_image",
        "sort_order",
        "is_active",
    )
    readonly_fields = ("preview",)

    @admin.display(description="تصویر")
    def preview(self, obj):
        url = obj.display_image_url if obj.pk else ""
        if not url:
            return "—"
        return format_html(
            '<img src="{}" style="width:64px;height:64px;object-fit:cover;border-radius:50%;border:1px solid #eee;" />',
            url,
        )


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 2
    fields = ("size", "stock", "is_active")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "product_count")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    ordering = ("name",)

    @admin.display(description="تعداد محصول")
    def product_count(self, obj):
        return obj.products.count()


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ("color_preview", "name", "hex_code", "product_count")
    search_fields = ("name", "hex_code")
    ordering = ("name",)

    @admin.display(description="رنگ")
    def color_preview(self, obj):
        return format_html(
            '<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:{};border:1px solid #ddd;vertical-align:middle;"></span>',
            obj.hex_code,
        )

    @admin.display(description="تعداد محصول")
    def product_count(self, obj):
        return obj.product_colors.count()


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order", "is_active", "product_count")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("sort_order", "name")

    @admin.display(description="تعداد محصول")
    def product_count(self, obj):
        return obj.product_sizes.count()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "name", "category", "price_display", "stock_total", "color_count", "is_active", "created_at")
    list_display_links = ("name",)
    list_filter = ("category", "is_active")
    search_fields = ("name", "description", "slug")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("stock_total", "thumbnail_large")
    fieldsets = (
        ("اطلاعات محصول", {
            "fields": ("name", "slug", "category", "price", "old_price", "description", "is_active")
        }),
        ("تصاویر اصلی", {
            "fields": ("thumbnail_large", "image", "hover_image")
        }),
        ("اطلاعات قدیمی تصویر", {
            "classes": ("collapse",),
            "fields": ("image_url", "hover_image_url")
        }),
        ("موجودی", {
            "fields": ("stock_total",)
        }),
    )
    inlines = (ProductColorInline, ProductSizeInline, ProductImageInline)
    list_per_page = 30
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    @admin.display(description="تصویر")
    def thumbnail(self, obj):
        url = obj.main_image_url
        if not url:
            return "—"
        return format_html(
            '<img src="{}" style="width:52px;height:52px;object-fit:cover;border-radius:10px;border:1px solid #eee;" />',
            url,
        )

    @admin.display(description="پیش‌نمایش")
    def thumbnail_large(self, obj):
        url = obj.main_image_url if obj.pk else ""
        if not url:
            return "بعد از ذخیره محصول، تصویر اینجا نمایش داده می‌شود."
        return format_html(
            '<img src="{}" style="width:180px;height:220px;object-fit:cover;border-radius:14px;border:1px solid #eee;" />',
            url,
        )

    @admin.display(description="قیمت")
    def price_display(self, obj):
        return f"{obj.price:,} تومان"

    @admin.display(description="موجودی کل")
    def stock_total(self, obj):
        return sum(item.stock for item in obj.sizes.all())

    @admin.display(description="تعداد رنگ")
    def color_count(self, obj):
        return obj.colors.filter(is_active=True).count()
