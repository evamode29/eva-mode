from django.contrib import admin
from django.urls import include, path

from products.views import home


urlpatterns = [
    path("admin/", admin.site.urls),
    path("shop/", include("products.urls")),
    path("", home, name="home"),
]
