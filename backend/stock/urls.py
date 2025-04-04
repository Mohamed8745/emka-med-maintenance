from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PieceDeRechangeViewSet, StockViewSet, StockPieceViewSet

# إنشاء Router لتسجيل ViewSets
router = DefaultRouter()
router.register(r'pieces', PieceDeRechangeViewSet, basename='piece')
router.register(r'stocks', StockViewSet, basename='stock')
router.register(r'stockpieces', StockPieceViewSet, basename='stockpiece')

urlpatterns = [
    path('', include(router.urls)),
]
