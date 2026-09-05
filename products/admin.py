from django.contrib import admin

from .models import Category, Product, ProductColor, ProductColorImage


class ProductColorImageInline(admin.TabularInline):
    model = ProductColorImage
    extra = 1
    fields = ("image", "sort_order", "is_active")


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = ("name", "hex_code", "image", "is_active", "sort_order")


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
    list_display = ("name", "product", "is_active", "sort_order")
    list_filter = ("is_active",)
    search_fields = ("name", "product__name")
    inlines = [ProductColorImageInline]


@admin.register(ProductColorImage)
class ProductColorImageAdmin(admin.ModelAdmin):
    list_display = ("color", "product_name", "sort_order", "is_active")
    list_filter = ("is_active", "color__product")
    search_fields = ("color__name", "color__product__name")
    ordering = ("color", "sort_order", "id")

    @admin.display(description="محصول")
    def product_name(self, obj):
        return obj.color.product.name
