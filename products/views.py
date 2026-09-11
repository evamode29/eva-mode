from django.db.models import Prefetch, Q
from django.shortcuts import get_object_or_404, render

from .models import Category, Product, ProductColor


def product_queryset():
    return (
        Product.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related(
            "gallery",
            "sizes__size",
            Prefetch(
                "colors",
                queryset=ProductColor.objects.filter(is_active=True).select_related("color"),
            ),
        )
    )


def home(request):
    products = product_queryset()[:8]
    categories = Category.objects.all()
    return render(request, "home.html", {"products": products, "categories": categories})


def shop(request):
    products = product_queryset()
    categories = Category.objects.all()

    category = request.GET.get("category", "").strip()
    query = request.GET.get("q", "").strip()
    sort = request.GET.get("sort", "newest").strip()

    if category:
        products = products.filter(category__slug=category)

    if query:
        products = products.filter(
            Q(name__icontains=query)
            | Q(description__icontains=query)
            | Q(category__name__icontains=query)
        )

    sort_map = {
        "price_low": "price",
        "price_high": "-price",
        "oldest": "created_at",
        "newest": "-created_at",
    }
    products = products.order_by(sort_map.get(sort, "-created_at"))

    return render(
        request,
        "products/shop.html",
        {
            "products": products,
            "categories": categories,
            "selected_category": category,
            "search_query": query,
            "selected_sort": sort if sort in sort_map else "newest",
        },
    )


def detail(request, slug):
    product = get_object_or_404(product_queryset(), slug=slug)
    return render(request, "products/detail.html", {"product": product})
