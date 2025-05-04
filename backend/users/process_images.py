# myapp/process_images.py

from django.core.files.base import ContentFile
from .models import Utilisateur
from PIL import Image
from io import BytesIO

def process_existing_images():
    instances = Utilisateur.objects.all()

    for instance in instances:
        if not instance.image:
            continue  # لا توجد صورة

        print(f"معالجة: {instance.image.name}")

        # فتح الصورة الأصلية
        instance.image.open()  # تأكد من فتح الصورة من جديد
        img = Image.open(instance.image).convert("RGBA")

        # تغيير الحجم (مثال: 300x300)
        img_resized = img.resize((300, 300))

        # حفظ الصورة في الذاكرة
        buffer = BytesIO()
        img_resized.save(buffer, format='PNG')
        image_file = ContentFile(buffer.getvalue())

        # حفظ الصورة الجديدة مكان القديمة
        instance.image.save(instance.image.name, image_file, save=False)
        instance.save()

    print("✅ تم تعديل حجم جميع الصور.")
