from django.shortcuts import get_object_or_404, render

from .models import Category, Product


def _prepare_products(products):
    """Add lightweight display data used by product cards."""
    for product in products:
        product.primary_color = product.colors.filter(is_active=True).first()
        product.discount_percent = 0
        if product.old_price and product.old_price > product.price:
            product.discount_percent = round(
                (product.old_price - product.price) * 100 / product.old_price
            )
    return products


def home(request):
    products = Product.objects.filter(is_active=True).prefetch_related("colors")[:8]
    products = _prepare_products(products)
    categories = Category.objects.all()
    return render(request, "home.html", {"products": products, "categories": categories})


def shop(request):
    products = Product.objects.filter(is_active=True).select_related("category").prefetch_related("colors")
    category = request.GET.get("category")
    query = (request.GET.get("q") or "").strip()
    if category:
        products = products.filter(category__slug=category)
    if query:
        products = products.filter(name__icontains=query)
    products = _prepare_products(products)
    return render(request, "products/shop.html", {
        "products": products,
        "categories": Category.objects.all(),
        "search_query": query,
    })


def detail(request, slug):
    product = get_object_or_404(
        Product.objects.select_related("category").prefetch_related("colors"),
        slug=slug,
        is_active=True,
    )
    product.primary_color = product.colors.filter(is_active=True).first()
    if product.old_price and product.old_price > product.price:
        product.discount_percent = round(
            (product.old_price - product.price) * 100 / product.old_price
        )
    else:
        product.discount_percent = 0
    return render(request, "products/detail.html", {
        "product": product,
        "categories": Category.objects.all(),
    })
