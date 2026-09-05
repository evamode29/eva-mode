import re
import secrets

from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render

from products.models import Product, ProductColor

from .models import Order, OrderItem


_FA_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


def _normalize_digits(value):
    return str(value or "").translate(_FA_DIGITS)


def _normalize_mobile(value):
    mobile = _normalize_digits(value).replace(" ", "").replace("-", "")
    if mobile.startswith("+98"):
        mobile = "0" + mobile[3:]
    elif mobile.startswith("0098"):
        mobile = "0" + mobile[4:]
    return mobile


def _normalize_postal_code(value):
    return re.sub(r"\s+", "", _normalize_digits(value))


def _parse_key(key):
    parts = str(key).split(":", 1)
    if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
        return int(parts[0]), int(parts[1])
    if str(key).isdigit():
        return int(key), None
    return None, None


def _cart_items(request):
    cart = request.session.get("cart", {})
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
            color = ProductColor.objects.filter(
                id=color_id,
                product=product,
                is_active=True,
            ).first()
            if not color:
                continue
        try:
            quantity = max(1, min(20, int(raw_quantity)))
        except (TypeError, ValueError):
            quantity = 1
        subtotal = product.price * quantity
        total += subtotal
        items.append({
            "product": product,
            "color": color,
            "quantity": quantity,
            "subtotal": subtotal,
            "key": key,
        })
    return items, total


def _checkout_context(items, total, profile, form_data=None, error="", checkout_token=""):
    return {
        "items": items,
        "total": total,
        "profile": profile,
        "form_data": form_data or {},
        "error": error,
        "checkout_token": checkout_token,
    }


@login_required(login_url="/account/")
def checkout(request):
    items, total = _cart_items(request)
    if not items:
        return redirect("cart:detail")

    profile = getattr(request.user, "customer_profile", None)

    if request.method == "POST":
        checkout_token = (request.POST.get("checkout_token") or "").strip()
        active_token = request.session.get("checkout_token", "")
        if not checkout_token or checkout_token != active_token:
            return redirect("cart:detail")

        full_name = " ".join((request.POST.get("full_name") or "").strip().split())
        mobile = _normalize_mobile(request.POST.get("mobile"))
        city = " ".join((request.POST.get("city") or "").strip().split())
        address = " ".join((request.POST.get("address") or "").strip().split())
        postal_code = _normalize_postal_code(request.POST.get("postal_code"))
        form_data = {
            "full_name": full_name,
            "mobile": mobile,
            "city": city,
            "postal_code": postal_code,
            "address": address,
        }

        errors = []
        if len(full_name) < 3:
            errors.append("نام و نام خانوادگی را کامل وارد کنید.")
        if not re.fullmatch(r"09\d{9}", mobile):
            errors.append("شماره موبایل باید به شکل ۰۹xxxxxxxxx باشد.")
        if len(city) < 2:
            errors.append("نام شهر را کامل وارد کنید.")
        if len(address) < 10:
            errors.append("آدرس کامل را وارد کنید.")
        if postal_code and not re.fullmatch(r"\d{10}", postal_code):
            errors.append("کد پستی باید دقیقاً ۱۰ رقم باشد.")

        if errors:
            return render(
                request,
                "orders/checkout.html",
                _checkout_context(
                    items,
                    total,
                    profile,
                    form_data=form_data,
                    error=" ".join(errors),
                    checkout_token=checkout_token,
                ),
            )

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                full_name=full_name,
                mobile=mobile,
                city=city,
                address=address,
                postal_code=postal_code,
                total=total,
            )
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    color=item["color"],
                    color_name=item["color"].name if item["color"] else "",
                    product_name=item["product"].name,
                    unit_price=item["product"].price,
                    quantity=item["quantity"],
                )
            request.session["cart"] = {}
            request.session.pop("checkout_token", None)
            request.session.modified = True

        return redirect("orders:success", order_id=order.id)

    checkout_token = secrets.token_urlsafe(24)
    request.session["checkout_token"] = checkout_token
    request.session.modified = True
    return render(
        request,
        "orders/checkout.html",
        _checkout_context(
            items,
            total,
            profile,
            checkout_token=checkout_token,
        ),
    )


@login_required(login_url="/account/")
def success(request, order_id):
    order = (
        Order.objects.filter(id=order_id, user=request.user)
        .prefetch_related("items")
        .first()
    )
    if not order:
        return redirect("orders:list")
    return render(request, "orders/success.html", {"order": order})


@login_required(login_url="/account/")
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, "orders/list.html", {"orders": orders})


@login_required(login_url="/account/")
def order_detail(request, order_id):
    order = (
        Order.objects.filter(id=order_id, user=request.user)
        .prefetch_related("items")
        .first()
    )
    if not order:
        return redirect("orders:list")
    return render(request, "orders/detail.html", {"order": order})
