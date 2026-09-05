import random
import time

from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from products.models import Product

from .models import CustomerProfile, FavoriteProduct
from .sms import send_otp_sms

OTP_TTL = 120
OTP_LENGTH = 6


def normalize_mobile(value):
    value = (value or "").strip().replace(" ", "").replace("-", "")
    if value.startswith("+98"):
        value = "0" + value[3:]
    elif value.startswith("0098"):
        value = "0" + value[4:]
    return value


def is_valid_mobile(value):
    return len(value) == 11 and value.startswith("09") and value.isdigit()


def login_view(request):
    if request.user.is_authenticated:
        return redirect("accounts:profile")
    if request.method == "POST":
        mobile = normalize_mobile(request.POST.get("mobile"))
        if not is_valid_mobile(mobile):
            return render(request, "accounts/login.html", {"error": "شماره موبایل معتبر نیست."})
        otp = f"{random.randint(0, 999999):06d}"
        sent, sms_message = send_otp_sms(mobile, otp)
        if not sent:
            print(f"\n[EVA MODE SMS ERROR] {mobile} -> {sms_message}\n")
            return render(request, "accounts/login.html", {"error": "ارسال کد تأیید انجام نشد. تنظیمات پیامک را بررسی کنید."})
        request.session["login_mobile"] = mobile
        request.session["login_otp"] = otp
        request.session["login_otp_created"] = int(time.time())
        request.session["login_otp_attempts"] = 0
        request.session.modified = True
        return redirect("accounts:verify")
    return render(request, "accounts/login.html")


def verify_view(request):
    mobile = request.session.get("login_mobile")
    created = request.session.get("login_otp_created")
    if not mobile or not created:
        return redirect("accounts:login")
    if int(time.time()) - int(created) > OTP_TTL:
        request.session.flush()
        return render(request, "accounts/login.html", {"error": "کد منقضی شده است. دوباره درخواست کد کنید."})
    if request.method == "POST":
        attempts = int(request.session.get("login_otp_attempts", 0))
        if attempts >= 5:
            request.session.flush()
            return render(request, "accounts/login.html", {"error": "تعداد تلاش‌ها تمام شد. دوباره درخواست کد کنید."})
        code = (request.POST.get("code") or "").strip()
        if code != request.session.get("login_otp"):
            request.session["login_otp_attempts"] = attempts + 1
            return render(request, "accounts/verify.html", {"mobile": mobile, "error": "کد واردشده صحیح نیست."})
        user, _ = User.objects.get_or_create(username=f"mobile_{mobile}")
        profile, _ = CustomerProfile.objects.get_or_create(user=user, defaults={"mobile": mobile})
        if profile.mobile != mobile:
            profile.mobile = mobile
            profile.save(update_fields=["mobile", "updated_at"])
        user.set_unusable_password()
        user.save(update_fields=["password"])
        login(request, user)
        for key in ["login_mobile", "login_otp", "login_otp_created", "login_otp_attempts"]:
            request.session.pop(key, None)
        return redirect("accounts:profile")
    return render(request, "accounts/verify.html", {"mobile": mobile})


def profile_view(request):
    if not request.user.is_authenticated:
        return redirect("accounts:login")
    profile, _ = CustomerProfile.objects.get_or_create(user=request.user, defaults={"mobile": request.user.username.removeprefix("mobile_")})
    return render(request, "accounts/profile.html", {"profile": profile})


def favorites_toggle(request, slug):
    if not request.user.is_authenticated:
        return JsonResponse({"ok": False, "login_required": True, "login_url": "/account/"}, status=401)
    product = get_object_or_404(Product, slug=slug, is_active=True)
    if request.method == "GET":
        favorite = FavoriteProduct.objects.filter(user=request.user, product=product).exists()
        return JsonResponse({"ok": True, "favorite": favorite})
    if request.method != "POST":
        return JsonResponse({"ok": False}, status=405)
    favorite, created = FavoriteProduct.objects.get_or_create(user=request.user, product=product)
    if not created:
        favorite.delete()
    return JsonResponse({"ok": True, "favorite": created, "count": FavoriteProduct.objects.filter(user=request.user).count()})


def favorites_view(request):
    if not request.user.is_authenticated:
        return redirect("accounts:login")
    favorites = FavoriteProduct.objects.filter(user=request.user).select_related("product", "product__category")
    return render(request, "accounts/favorites.html", {"favorites": favorites})


def logout_view(request):
    logout(request)
    return redirect("/")
