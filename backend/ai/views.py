from rest_framework import viewsets, permissions
from .models import AIAnalyzer, Recommendation, Diagnostic
from .serializers import AIAnalyzerSerializer, RecommendationSerializer, DiagnosticSerializer

class AIAnalyzerViewSet(viewsets.ModelViewSet):
    """
    API لإدارة تحليلات الذكاء الاصطناعي.
    """
    queryset = AIAnalyzer.objects.all()
    serializer_class = AIAnalyzerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RecommendationViewSet(viewsets.ModelViewSet):
    """
    API لإدارة التوصيات.
    """
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DiagnosticViewSet(viewsets.ModelViewSet):
    """
    API لإدارة التشخيصات.
    """
    queryset = Diagnostic.objects.all()
    serializer_class = DiagnosticSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
