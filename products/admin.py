from django.contrib import admin

from .models import Category, Product, ProductColor


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
