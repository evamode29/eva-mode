from django.shortcuts import get_object_or_404, render
from .models import Category, Product


def home(request):
    products = Product.objects.filter(is_active=True).select_related("category")[:12]
    categories = Category.objects.filter(is_active=True)
    return render(request, "home.html", {"products": products, "categories": categories})


def shop(request):
    products = Product.objects.filter(is_active=True).select_related("category")
    categories = Category.objects.filter(is_active=True)
    return render(request, "shop.html", {"products": products, "categories": categories})


def product_detail(request, slug):
    product = get_object_or_404(Product.objects.select_related("category"), slug=slug, is_active=True)
    return render(request, "product_detail.html", {"product": product})
