from django.db.models import Prefetch
from django.shortcuts import get_object_or_404, render

from .models import Category, Product, ProductColor


def product_queryset():
    return Product.objects.filter(is_active=True).select_related("category").prefetch_related(
        "gallery",
        Prefetch("colors", queryset=ProductColor.objects.filter(is_active=True).select_related("color")),
    )


def home(request):
    products = product_queryset()[:8]
    categories = Category.objects.all()
    return render(request, "home.html", {"products": products, "categories": categories})


def shop(request):
    products = product_queryset()
    category = request.GET.get("category")
    if category:
        products = products.filter(category__slug=category)
    return render(request, "products/shop.html", {"products": products, "categories": Category.objects.all()})


def detail(request, slug):
    product = get_object_or_404(product_queryset(), slug=slug)
    return render(request, "products/detail.html", {"product": product})
