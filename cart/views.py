from django.shortcuts import get_object_or_404, redirect, render

from products.models import Product


def _get_cart(request):
    return request.session.get("cart", {})


def _save_cart(request, cart):
    request.session["cart"] = cart
    request.session.modified = True


def cart_detail(request):
    cart = _get_cart(request)
    ids = [int(pk) for pk in cart.keys() if str(pk).isdigit()]
    products = Product.objects.filter(id__in=ids, is_active=True)
    items = []
    total = 0
    for product in products:
        quantity = max(1, int(cart.get(str(product.id), 1)))
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "quantity": quantity, "subtotal": subtotal})
    return render(request, "cart/cart.html", {"items": items, "total": total})


def add_to_cart(request, product_id):
    if request.method != "POST":
        return redirect("products:detail", slug=get_object_or_404(Product, id=product_id).slug)
    product = get_object_or_404(Product, id=product_id, is_active=True)
    cart = _get_cart(request)
    key = str(product.id)
    cart[key] = min(int(cart.get(key, 0)) + 1, 20)
    _save_cart(request, cart)
    return redirect("cart:detail")


def update_cart(request, product_id):
    if request.method == "POST":
        product = get_object_or_404(Product, id=product_id, is_active=True)
        cart = _get_cart(request)
        key = str(product.id)
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


def remove_from_cart(request, product_id):
    if request.method == "POST":
        cart = _get_cart(request)
        cart.pop(str(product_id), None)
        _save_cart(request, cart)
    return redirect("cart:detail")
