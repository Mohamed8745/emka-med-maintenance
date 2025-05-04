# myapp/process_images.py
"""
from django.core.files.base import ContentFile
from .models import PieceDeRechange
from PIL import Image
from rembg import remove
from io import BytesIO

def process_existing_images():
    instances = PieceDeRechange.objects.all()

    for instance in instances:
        if not instance.image:
            continue  # لا توجد صورة

        print(f"معالجة: {instance.image.name}")

        # فتح وقراءة الصورة
        original_bytes = instance.image.read()
        img_no_bg = remove(original_bytes)

        # فتح الصورة بدون خلفية وتعديل الحجم
        img_no_bg = Image.open(BytesIO(img_no_bg)).convert("RGBA")
        img_resized = img_no_bg.resize((300, 300))

        # حفظ الصورة الجديدة في الذاكرة
        buffer = BytesIO()
        img_resized.save(buffer, format='PNG')
        image_file = ContentFile(buffer.getvalue())

        # حفظها مكان الصورة الأصلية
        instance.image.save(instance.image.name, image_file, save=False)
        instance.save()

    print("✅ تمت معالجة جميع الصور.")
"""