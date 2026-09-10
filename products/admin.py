from django.contrib import admin

from .models import Category, Color, Product, ProductColor, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 2
    fields = ("image_url", "alt_text", "sort_order", "is_hover")


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = ("color", "image_url", "hover_image_url", "sort_order", "is_active")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ("name", "hex_code")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = (ProductImageInline, ProductColorInline)
