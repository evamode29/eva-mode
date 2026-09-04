from django.contrib import admin
from django.urls import include, path

from products.views import home


urlpatterns = [
    path("admin/", admin.site.urls),
    path("shop/", include("products.urls")),
    path("account/", include("accounts.urls")),
    path("cart/", include("cart.urls")),
    path("orders/", include("orders.urls")),
    path("", home, name="home"),
]
