from django.contrib import admin

from .models import Category, Color, Product, ProductColor, ProductImage, ProductSize, Size


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 2
    fields = ("image", "image_url", "alt_text", "sort_order", "is_hover")


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = (
        "color",
        "image",
        "hover_image",
        "image_url",
        "hover_image_url",
        "sort_order",
        "is_active",
    )


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 2
    fields = ("size", "stock", "is_active")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ("name", "hex_code")
    search_fields = ("name",)


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock_total", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("stock_total",)
    inlines = (ProductImageInline, ProductColorInline, ProductSizeInline)

    @admin.display(description="موجودی کل")
    def stock_total(self, obj):
        return sum(item.stock for item in obj.sizes.all())
