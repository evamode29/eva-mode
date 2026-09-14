from django.contrib import admin

from .models import CartItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "color_name", "size_name", "unit_price", "quantity", "line_total")
    fields = ("product_name", "color_name", "size_name", "unit_price", "quantity", "line_total")

    @admin.display(description="جمع")
    def line_total(self, obj):
        return f"{obj.line_total:,} تومان"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("number", "user", "status", "total_display", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("number", "user__username", "full_name", "phone", "city")
    readonly_fields = ("number", "created_at", "updated_at", "subtotal", "shipping", "total")
    inlines = [OrderItemInline]
    date_hierarchy = "created_at"

    @admin.display(description="مبلغ نهایی")
    def total_display(self, obj):
        return f"{obj.total:,} تومان"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "color", "size", "quantity", "line_total_display", "updated_at")
    search_fields = ("user__username", "product__name")
    list_filter = ("updated_at",)
    readonly_fields = ("line_total_display",)

    @admin.display(description="جمع")
    def line_total_display(self, obj):
        return f"{obj.line_total:,} تومان"
