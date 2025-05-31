from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, LogoutView, ProtectedView, UserView, UtilisateurViewSet, MagasinierViewSet, OperateurViewSet, AdministrateurViewSet, ResponsableViewSet, TechnicienViewSet, CompanyViewSet, StatusAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import (
    LoginView, LogoutView, ProtectedView, UserView,
    UtilisateurViewSet, MagasinierViewSet, OperateurViewSet,
    AdministrateurViewSet, ResponsableViewSet, TechnicienViewSet,
    CompanyViewSet, StatusAPIView,
    CompanyCreateView, CompanyListView, CompanyDetailView,
    CompanyUpdateView, CompanyDeleteView
)

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
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user/', UserView.as_view(), name='user-info'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/protected/', ProtectedView.as_view(), name='protected'),
    path('api/status/', StatusAPIView.as_view(), name="status"),
    path('company/create/', CompanyCreateView.as_view(), name='company-create'),
    path('company/list/', CompanyListView.as_view(), name='company-list'),
    path('company/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    path('company/<int:pk>/update/', CompanyUpdateView.as_view(), name='company-update'),
    path('company/<int:pk>/delete/', CompanyDeleteView.as_view(), name='company-delete'),
]

