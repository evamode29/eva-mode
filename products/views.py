from django.shortcuts import get_object_or_404, render

from .models import Category, Product


def home(request):
    products = Product.objects.filter(is_active=True).prefetch_related("colors")[:8]
    categories = Category.objects.all()
    return render(request, "home.html", {"products": products, "categories": categories})


def shop(request):
    products = Product.objects.filter(is_active=True).select_related("category").prefetch_related("colors")
    category = request.GET.get("category")
    if category:
        products = products.filter(category__slug=category)
    return render(request, "products/shop.html", {"products": products, "categories": Category.objects.all()})


def detail(request, slug):
    product = get_object_or_404(
        Product.objects.select_related("category").prefetch_related("colors"),
        slug=slug,
        is_active=True,
    )
    return render(request, "products/detail.html", {"product": product})
