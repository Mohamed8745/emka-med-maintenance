from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Probleme, Rapport
from .serializers import ProblemeSerializer, RapportSerializer

# ✅ عرض كل المشاكل أو إنشاء مشكلة جديدة
class ProblemeListCreateView(generics.ListCreateAPIView):
    queryset = Probleme.objects.all()
    serializer_class = ProblemeSerializer

# ✅ عرض، تعديل، حذف مشكلة معينة
class ProblemeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Probleme.objects.all()
    serializer_class = ProblemeSerializer

# ✅ تغيير حالة المشكلة
class ProblemeChangeStatutView(APIView):
    def post(self, request, pk):
        new_statut = request.data.get('new_statut')
        try:
            probleme = Probleme.objects.get(pk=pk)
            probleme.change_statut(new_statut)
            return Response({"message": "Statut mis à jour avec succès."})
        except Probleme.DoesNotExist:
            return Response({"error": "Problème non trouvé."}, status=404)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)


#  عرض أو إنشاء تقرير
class RapportListCreateView(generics.ListCreateAPIView):
    queryset = Rapport.objects.all()
    serializer_class = RapportSerializer

#  عرض، تعديل، حذف تقرير معين
class RapportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rapport.objects.all()
    serializer_class = RapportSerializer

# توليد PDF للتقرير (فقط واجهة مبدئية)
class RapportGenererPDFView(APIView):
    def post(self, request, pk):
        try:
            rapport = Rapport.objects.get(pk=pk)
            rapport.generer_pdf()
            return Response({"message": "PDF généré avec succès (simulation)."})
        except Rapport.DoesNotExist:
            return Response({"error": "Rapport non trouvé."}, status=404)
        
from django.http import JsonResponse
from stock.models import PieceDeRechange

import os
from django.http import JsonResponse
from django.conf import settings
from stock.models import PieceDeRechange

def refresh_images(request):
    if request.method == 'GET':
        updated = 0
        for p in PieceDeRechange.objects.exclude(image=''):
            try:
                image_path = p.image.path
            except ValueError:
                print(f"⛔ No image path for: {p.reference}")
                continue
            except Exception as e:
                print(f"⚠️ Error accessing image path for {p.reference}: {e}")
                continue

            if not os.path.isfile(image_path):
                print(f"⛔ File not found: {image_path}")
                continue

            try:
                # إعادة الحفظ لتفعيل معالجة الصورة
                original = p.image
                p.image = None
                p.save(update_fields=["image"])
                p.image = original
                p.save()
                updated += 1
                print(f"✅ Updated: {p.reference}")
            except Exception as e:
                print(f"❌ Failed to update {p.reference}: {e}")
                continue

        return JsonResponse({'status': 'done', 'updated': updated})