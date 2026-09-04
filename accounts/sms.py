import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings

SMSIR_VERIFY_URL = "https://api.sms.ir/v1/send/verify"


def send_otp_sms(mobile: str, otp: str) -> tuple[bool, str]:
    """Send an OTP through SMS.ir's Verify API."""
    api_key = settings.SMSIR_API_KEY
    template_id = settings.SMSIR_TEMPLATE_ID
    parameter_name = settings.SMSIR_OTP_PARAMETER_NAME

    if not api_key:
        return False, "SMSIR_API_KEY تنظیم نشده است."
    if not template_id:
        return False, "SMSIR_TEMPLATE_ID تنظیم نشده است."

    payload = {
        "mobile": mobile,
        "templateId": int(template_id),
        "parameters": [
            {
                "name": parameter_name,
                "value": otp,
            }
        ],
    }

    request = Request(
        SMSIR_VERIFY_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=15) as response:
            raw = response.read().decode("utf-8", errors="replace")
            if 200 <= response.status < 300:
                return True, raw
            return False, f"SMS.ir HTTP {response.status}: {raw}"
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        return False, f"SMS.ir HTTP {exc.code}: {raw}"
    except URLError as exc:
        return False, f"اتصال به SMS.ir برقرار نشد: {exc.reason}"
    except Exception as exc:
        return False, f"خطای ارسال SMS: {exc}"
