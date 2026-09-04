from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponse


def home(request):
    return HttpResponse("<h1 style='font-family:sans-serif;text-align:center;margin-top:20vh'>EVA MODE Django is running ✓</h1>")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("shop/", include("products.urls")),
    path("", home, name="home"),
]
