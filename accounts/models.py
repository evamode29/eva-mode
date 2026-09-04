from django.conf import settings
from django.db import models


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile",
    )
    mobile = models.CharField("شماره موبایل", max_length=11, unique=True)
    full_name = models.CharField("نام و نام خانوادگی", max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "پروفایل مشتری"
        verbose_name_plural = "پروفایل مشتریان"
        ordering = ["-created_at"]

    def __str__(self):
        return self.full_name or self.mobile
