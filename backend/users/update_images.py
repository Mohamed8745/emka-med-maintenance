import os
import sys
from datetime import datetime

# ✨ إعداد بيئة Django
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

# 📦 استيراد الموديل
from users.models import Utilisateur

# ✅ تحديث كل الصور الموجودة فقط
for user in Utilisateur.objects.exclude(image=''):
    if user.image:
        print(f"📦 Updating image for user {user.pk}...")
        user.save()  # هذا سيعيد تنظيم الصورة حسب التاريخ الحالي إن كانت موجودة
