from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, UserView, UtilisateurViewSet, MagasinierViewSet, OperateurViewSet, AdministrateurViewSet, ResponsableViewSet, TechnicienViewSet, CompanyViewSet

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'magasiniers', MagasinierViewSet)
router.register(r'operateurs', OperateurViewSet)
router.register(r'administrateurs', AdministrateurViewSet)
router.register(r'responsables', ResponsableViewSet)
router.register(r'techniciens', TechnicienViewSet)
router.register(r'company', CompanyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user-info'),
]

