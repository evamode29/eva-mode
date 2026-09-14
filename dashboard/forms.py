import re

from django import forms


_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


class PhoneLoginForm(forms.Form):
    phone = forms.CharField(
        label="شماره موبایل",
        max_length=20,
        widget=forms.TextInput(attrs={
            "inputmode": "tel", "autocomplete": "tel",
            "placeholder": "مثلاً 09123456789", "dir": "ltr",
        }),
    )

    def clean_phone(self):
        phone = self.cleaned_data["phone"].strip().replace(" ", "").replace("-", "").translate(_DIGITS)
        if phone.startswith("+98"):
            phone = "0" + phone[3:]
        elif phone.startswith("98"):
            phone = "0" + phone[2:]
        if not re.fullmatch(r"09\d{9}", phone):
            raise forms.ValidationError("شماره موبایل معتبر وارد کنید.")
        return phone


class OTPVerifyForm(forms.Form):
    code = forms.CharField(
        label="کد تأیید",
        max_length=6,
        min_length=6,
        widget=forms.TextInput(attrs={
            "inputmode": "numeric", "autocomplete": "one-time-code",
            "placeholder": "••••••", "dir": "ltr", "maxlength": "6",
        }),
    )

    def clean_code(self):
        code = self.cleaned_data["code"].strip().translate(_DIGITS)
        if not code.isdigit() or len(code) != 6:
            raise forms.ValidationError("کد باید ۶ رقم باشد.")
        return code
