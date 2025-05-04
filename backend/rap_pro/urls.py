
from django.urls import path
from .views import (
    ProblemeListCreateView, ProblemeDetailView, ProblemeChangeStatutView,
    RapportListCreateView, RapportDetailView, RapportGenererPDFView,
    refresh_images
)

urlpatterns = [
    # Probleme URLs
    path('problemes/', ProblemeListCreateView.as_view()),
    path('problemes/<int:pk>/', ProblemeDetailView.as_view()),
    path('problemes/<int:pk>/changer-statut/', ProblemeChangeStatutView.as_view()),

    # Rapport URLs
    path('rapports/', RapportListCreateView.as_view()),
    path('rapports/<int:pk>/', RapportDetailView.as_view()),
    path('rapports/<int:pk>/generer-pdf/', RapportGenererPDFView.as_view()),
    path('refresh-images/', refresh_images, name='refresh_images'),
]
