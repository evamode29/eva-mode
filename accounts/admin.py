from django.contrib import admin

from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("mobile", "full_name", "created_at")
    search_fields = ("mobile", "full_name", "user__username")
