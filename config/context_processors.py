from products.models import Category


def eva_context(request):
    cart = request.session.get("cart", {})
    cart_count = 0
    for quantity in cart.values():
        try:
            cart_count += max(0, min(20, int(quantity)))
        except (TypeError, ValueError):
            continue

    return {
        "eva_categories": Category.objects.all(),
        "cart_count": cart_count,
    }
