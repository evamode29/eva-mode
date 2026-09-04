from django.shortcuts import get_object_or_404, redirect, render

from products.models import Product, ProductColor


def _get_cart(request):
    return request.session.get("cart", {})


def _save_cart(request, cart):
    request.session["cart"] = cart
    request.session.modified = True


def _parse_key(key):
    parts = str(key).split(":", 1)
    if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
        return int(parts[0]), int(parts[1])
    if str(key).isdigit():
        return int(key), None
    return None, None


def cart_detail(request):
    cart = _get_cart(request)
    items = []
    total = 0
    for key, raw_quantity in cart.items():
        product_id, color_id = _parse_key(key)
        if not product_id:
            continue
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            continue
        color = None
        if color_id:
            color = ProductColor.objects.filter(id=color_id, product=product, is_active=True).first()
            if not color:
                continue
        try:
            quantity = max(1, min(20, int(raw_quantity)))
        except (TypeError, ValueError):
            quantity = 1
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "color": color, "quantity": quantity, "subtotal": subtotal, "key": key})
    return render(request, "cart/cart.html", {"items": items, "total": total})


def add_to_cart(request, product_id):
    if request.method != "POST":
        return redirect("products:detail", slug=get_object_or_404(Product, id=product_id).slug)
    product = get_object_or_404(Product, id=product_id, is_active=True)
    color_id = (request.POST.get("color_id") or "").strip()
    color = None
    if color_id:
        color = get_object_or_404(ProductColor, id=color_id, product=product, is_active=True)
    elif product.colors.filter(is_active=True).exists():
        return redirect(product.get_absolute_url())
    key = f"{product.id}:{color.id}" if color else str(product.id)
    cart = _get_cart(request)
    cart[key] = min(int(cart.get(key, 0)) + 1, 20)
    _save_cart(request, cart)
    return redirect("cart:detail")


def update_cart(request, product_id, color_id=None):
    if request.method == "POST":
        product = get_object_or_404(Product, id=product_id, is_active=True)
        color = None
        if color_id is not None:
            color = get_object_or_404(ProductColor, id=color_id, product=product, is_active=True)
        key = f"{product.id}:{color.id}" if color else str(product.id)
        cart = _get_cart(request)
        try:
            quantity = int(request.POST.get("quantity", 1))
        except ValueError:
            quantity = 1
        if quantity <= 0:
            cart.pop(key, None)
        else:
            cart[key] = min(quantity, 20)
        _save_cart(request, cart)
    return redirect("cart:detail")


def remove_from_cart(request, product_id, color_id=None):
    if request.method == "POST":
        cart = _get_cart(request)
        key = f"{product_id}:{color_id}" if color_id is not None else str(product_id)
        cart.pop(key, None)
        _save_cart(request, cart)
    return redirect("cart:detail")
