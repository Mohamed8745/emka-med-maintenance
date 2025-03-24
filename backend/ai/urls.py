from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIAnalyzerViewSet, RecommendationViewSet, DiagnosticViewSet

router = DefaultRouter()
router.register(r'analyzers', AIAnalyzerViewSet)
router.register(r'recommendations', RecommendationViewSet)
router.register(r'diagnostics', DiagnosticViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
