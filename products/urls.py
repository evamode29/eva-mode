from django.urls import path

from . import views

app_name = "products"

urlpatterns = [
    path("shop/", views.shop, name="shop"),
    path("product/<slug:slug>/", views.detail, name="detail"),
]
