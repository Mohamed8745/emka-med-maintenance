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
